import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log(`Proxying: ${req.method} ${req.url}`);
            
  
            if (req.headers["content-type"]?.includes("multipart/form-data")) {
    
              proxyReq.setHeader("Content-Type", req.headers["content-type"]);
              
    
              if (req.body && !(req.body instanceof Buffer)) {
                let body = "";
                req.on("data", (chunk) => {
                  body += chunk;
                });
                req.on("end", () => {
                  proxyReq.write(body);
                  proxyReq.end();
                });
              }
            }
          });
        },
      },
    },
  },
});