# Stage 1: Build
FROM node:latest AS build
# Copy app
COPY . /home/pixfar/german-law-server
WORKDIR /home/pixfar/
RUN cd german-law-server \
    && npm install \
    && npm run build \
    && rm -fr node_modules \
    && npm install --only=production

# Stage 2: Final Image
FROM node:slim

# Install packages
RUN apt-get update && apt-get install -y gettext-base && apt-get clean

# Setup docker-entrypoint
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Add non-root user
RUN useradd -ms /bin/bash pixfar
WORKDIR /home/pixfar/german-law-server
COPY --from=build /home/pixfar/german-law-server .

RUN chown -R pixfar:pixfar /home/pixfar
# set project directory
WORKDIR /home/pixfar/german-law-server

RUN mkdir -p /home/pixfar/german-law-server/uploads/bucket-category-image
RUN mkdir -p /home/pixfar/german-law-server/uploads/surprise-bucket-image
RUN mkdir -p /home/pixfar/german-law-server/uploads/user-profile-image


RUN chmod -R 777 /home/pixfar/german-law-server/uploads

# Expose port
EXPOSE 3000

# Ensure entrypoint script is executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]