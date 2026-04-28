FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN rm -f tsconfig.tsbuildinfo
RUN npm run build

# Server
ENV PORT=3000

# Database
ENV DB_HOST=toroto_db_server
ENV DB_PORT=5432
ENV DB_USER=toroto_user
ENV DB_PASSWORD=toroto2026
ENV DB_NAME=geo-toroto
ENV DATABASE_URL=postgresql://toroto_user:toroto2026@toroto_db_server:5432/geo-toroto

# Groq
ENV GROQ_API_KEY=your_api_key_here
ENV GROQ_MODEL=llama-3.3-70b-versatile
ENV GROQ_MODEL_NATURAL_LANGUAGE_MESSAGE="Eres TOROTO-AI, un asistente experto en análisis de intervenciones ambientales geoespaciales. Se te entregan resultados de una consulta. Resume la información de forma clara, directa y en el mismo idioma en que el usuario hizo la pregunta. No menciones términos técnicos como query_type, base de datos o SQL. Habla directamente sobre las intervenciones."

EXPOSE 3000
CMD ["node", "dist/main"]