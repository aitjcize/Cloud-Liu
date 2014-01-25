HOST = https://dl.dropboxusercontent.com/u/260733006
ROOT = app
JS = bookmarklet.js cloud-liu.js cloud-liu-loader.js

dist-copy:
	rm -rf dist
	mkdir dist
	cp -r $(ROOT)/static dist
	cd dist/static/js; \
	sed -i "s+__HOST__+$(HOST)+g" cloud-liu-loader.js bookmarklet.js

dist-uglify: dist-copy
	cd dist/static/js; \
	for i in $(JS); do \
	  uglifyjs $$i > $${i/.js/.min.js}; \
	  rm $$i; \
	done

dist: dist-uglify
	echo 'done'
