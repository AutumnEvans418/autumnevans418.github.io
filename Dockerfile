FROM debian:latest

# Update the package index and install necessary packages
RUN apt-get update && apt-get install -y \ 
    ruby \
    ruby-bundler \
    ruby-dev \
    nano \
    systemctl \
    nginx \
    build-essential \ 
    curl \
 && rm -rf /var/lib/apt/lists/* 

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Set the working directory to /app
WORKDIR /app

# Display Ruby version and bundler version
RUN ruby --version && bundle --version && gem install bundler jekyll

# Command to run when the container starts
#CMD ["irb"]
ENTRYPOINT [ "./run.sh" ]