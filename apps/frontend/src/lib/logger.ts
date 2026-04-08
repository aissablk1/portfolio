type LogLevel = "info" | "error" | "debug";

export const Logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, data ? data : "");
  },

  error: (message: string, error?: any) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, {
      message: error?.message,
      stack: error?.stack,
      raw: error,
    });
  },

  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEBUG] [${new Date().toISOString()}] ${message}`, data ? data : "");
    }
  },
};
