HOST = https://dl.dropboxusercontent.com/u/260733006
JS = bookmarklet.js cloud-liu.js cloud-liu-loader.js

all: dev

dev:
	rm -rf app/static
	cp -r static app
	cd app/static/js; \
	sed -i "s+__HOST__+http://localhost:5000+g" cloud-liu-loader.js bookmarklet.js; \
	for i in $(JS); do \
	  mv $$i $${i/.js/.min.js}; \
	done; \
	cat cliu-loader.pre.js require.js cloud-liu-loader.min.js cliu-loader.post.js > cliu-loader.js;
	cd app/static/css; \
	sed -i "s+__HOST__+http://localhost:5000+g" cloud-liu.css

dist-copy:
	rm -rf dist
	mkdir dist
	cp -r static dist
	cd dist/static/js; \
	sed -i "s+__HOST__+$(HOST)+g" cloud-liu-loader.js bookmarklet.js;
	cd dist/static/css; \
	sed -i "s+__HOST__+$(HOST)+g" cloud-liu.css

dist-uglify: dist-copy
	cd dist/static/js; \
	for i in $(JS); do \
	  uglifyjs $$i > $${i/.js/.min.js}; \
	  rm $$i; \
	done

dist-combine: dist-uglify
	cd dist/static/js; \
	cat cliu-loader.pre.js require.js cloud-liu-loader.min.js cliu-loader.post.js > cliu-loader.js;

dist: dist-combine
	echo 'done'
