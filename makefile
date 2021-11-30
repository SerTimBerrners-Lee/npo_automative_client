build:
	docker build -t npo-client .
run:
	docker run -p 80:8080 -v "$(CURDIR):/usr/src/app" -d --rm --name npo-client npo-client
stop: 
	docker stop npo-client
rmi:
	docker rmi npo-client
copy:
	git reset --hard HEAD 
	git pull
	git status
	npm run build
	cp -r dist/* /var/www/html