build:
	docker build -t npo-client .
run:
	docker run -p 80:8080 -v "$(CURDIR):/usr/src/app" -d --rm --name npo-client npo-client
stop: 
	docker stop npo-client