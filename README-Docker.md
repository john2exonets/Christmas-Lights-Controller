Christmas-Lights-Controller Docker Container
============================================

Containerized xmaslights.js program.

1. Buld the Container.
I have included my own build script, but use what works for you.

<pre>
# Bump version number & build
VERSION=$(cat VERSION | perl -pe 's/^((\d+\.)*)(\d+)(.*)$/$1.($3+1).$4/e' | tee VERSION)
docker build -t jdallen/xmaslights:$VERSION -t jdallen/xmaslights:latest .
</pre>

2. Run the Container.

<pre>
docker run -d --restart=always \
  --name=xmaslights \
  --volume /root/Docker/XmasLights:/mqtt/config \
  --volume /etc/locatime:/etc/localtime:ro |
  jdallen/xmaslights:latest
</pre>

