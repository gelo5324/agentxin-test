FROM node:17.0.1 as builder

WORKDIR /opt/xinmeta-portal-web
COPY . .

# RUN rm -f package-lock.json
# RUN ls
# RUN node -v
# Run npm -v
# RUN npm install -g npm@8.1.0
# RUN npm config set registry  https://verdaccio.xinproptech.com/

# RUN npm install -f

# RUN npm run build


FROM nginx:1.24.0

COPY --from=builder /opt/xinmeta-portal-web/dist /etc/nginx/html
COPY --from=builder /opt/xinmeta-portal-web/WW_verify_J41I8mRA6wab1SvT.txt /etc/nginx/html
COPY nginx.conf /etc/nginx/


EXPOSE 8080


ENTRYPOINT ["nginx"]
CMD ["-g","daemon off;"]
