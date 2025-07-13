from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from models import ContactFormData, ContactSubmission, ContactResponse
from services.email_service import EmailService
from services.spam_protection import SpamProtection
from services.notification_service import NotificationService
from services.storage_service import StorageService
import asyncio
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Services
email_service = EmailService()
spam_protection = SpamProtection()
notification_service = NotificationService()
storage_service = StorageService()

# Create the main app without a prefix
app = FastAPI(title="Aïssa BELKOUSSA Portfolio API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def get_client_ip(request: Request) -> str:
    """Get client IP address from request"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"

def get_user_agent(request: Request) -> str:
    """Get user agent from request"""
    return request.headers.get("User-Agent", "unknown")

@api_router.get("/")
async def root():
    return {"message": "Portfolio API is running", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await db.command("ping")
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "connected",
            "services": {
                "email": bool(os.getenv('EMAIL_USER')),
                "telegram": bool(os.getenv('TELEGRAM_BOT_TOKEN')),
                "notion": bool(os.getenv('NOTION_TOKEN')),
                "google_sheets": bool(os.getenv('GOOGLE_SHEETS_WEBHOOK_URL'))
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unavailable")

@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact_form(
    form_data: ContactFormData,
    request: Request
):
    """Handle contact form submission with spam protection and notifications"""
    try:
        # Get client information
        ip_address = get_client_ip(request)
        user_agent = get_user_agent(request)
        
        logger.info(f"Contact form submission from {ip_address}: {form_data.name} <{form_data.email}>")
        
        # Rate limiting check
        if not spam_protection.check_rate_limit(ip_address):
            logger.warning(f"Rate limit exceeded for IP: {ip_address}")
            raise HTTPException(
                status_code=429,
                detail="Trop de tentatives. Veuillez patienter avant de renvoyer un message."
            )
        
        # Create submission record
        submission = ContactSubmission(
            name=form_data.name,
            email=form_data.email,
            subject=form_data.subject,
            message=form_data.message,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        # Spam detection
        submission_dict = submission.dict()
        is_spam, spam_score, spam_reason = spam_protection.is_spam(submission_dict)
        
        if is_spam:
            submission.status = "spam"
            # Save spam submission for monitoring
            await db.contact_submissions.insert_one(submission.dict())
            logger.warning(f"Spam submission blocked: {spam_reason}")
            raise HTTPException(
                status_code=400,
                detail="Votre message a été identifié comme spam. Veuillez contacter directement via WhatsApp."
            )
        
        # Save to database
        submission.status = "pending"
        result = await db.contact_submissions.insert_one(submission.dict())
        submission_id = str(result.inserted_id)
        
        logger.info(f"Contact submission saved with ID: {submission_id}")
        
        # Background tasks for notifications and external services
        async def send_notifications_and_save():
            try:
                # Send email notification
                email_sent = email_service.send_contact_notification(submission_dict)
                
                # Send auto-reply
                auto_reply_sent = email_service.send_auto_reply(submission_dict)
                
                # Send instant notifications
                notification_results = notification_service.send_notifications(submission_dict)
                
                # Save to external services
                storage_results = storage_service.save_submission(submission_dict)
                
                # Update submission status
                await db.contact_submissions.update_one(
                    {"_id": result.inserted_id},
                    {
                        "$set": {
                            "status": "processed",
                            "email_sent": email_sent,
                            "auto_reply_sent": auto_reply_sent,
                            "notifications": notification_results,
                            "storage": storage_results,
                            "processed_at": datetime.utcnow()
                        }
                    }
                )
                
                logger.info(f"Contact submission {submission_id} processed successfully")
                
            except Exception as e:
                logger.error(f"Error processing contact submission {submission_id}: {str(e)}")
                # Update status to indicate processing error
                await db.contact_submissions.update_one(
                    {"_id": result.inserted_id},
                    {"$set": {"status": "error", "error_message": str(e)}}
                )
        
        # Start background task
        asyncio.create_task(send_notifications_and_save())
        
        # Return immediate response
        return ContactResponse(
            success=True,
            message="Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.",
            submission_id=submission.id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in contact form submission: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer ou me contacter directement via WhatsApp."
        )

@api_router.get("/contact/stats")
async def get_contact_stats():
    """Get contact form statistics (for admin use)"""
    try:
        total_submissions = await db.contact_submissions.count_documents({})
        pending_submissions = await db.contact_submissions.count_documents({"status": "pending"})
        processed_submissions = await db.contact_submissions.count_documents({"status": "processed"})
        spam_submissions = await db.contact_submissions.count_documents({"status": "spam"})
        
        return {
            "total": total_submissions,
            "pending": pending_submissions,
            "processed": processed_submissions,
            "spam": spam_submissions,
            "success_rate": round((processed_submissions / total_submissions * 100) if total_submissions > 0 else 0, 2)
        }
    except Exception as e:
        logger.error(f"Error getting contact stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving statistics")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
