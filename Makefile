#HOST = https://s3-ap-northeast-1.amazonaws.com/cloudliu
HOST = https://dl.dropboxusercontent.com/u/260733006

JS = bookmarklet.js cloud-liu.js cloud-liu-loader.js
UNEEDED_FILES = \
		static/js/require.js \
		static/js/bookmarklet.min.js \
		static/js/bootstrap.min.js \
		static/js/cliu-loader.post.js \
		static/js/cliu-loader.pre.js \
		static/js/cloud-liu-loader.min.js \
		static/css/bootstrap.min.css \
		static/css/bootstrap-theme.min.css \
		static/css/style.css
NEED_GZIP = \
	    static/js/boshiamy.db.js \
	    static/js/cliu-loader.min.js \
	    static/js/cloud-liu.min.js \
	    static/js/jquery-1.10.2.min.js \
	    static/js/jquery-textrange.min.js \
	    static/js/jquery-ui-1.10.4.custom.min.js \
	    static/js/sql.min.js \
	    static/css/cloud-liu.css

all: dev

dev:
	cd app/static/js; \
	for i in $(JS); do \
		cp -f $$i $${i/.js/.min.js}; \
		sed -i "s+__HOST__+http://localhost:5000+g" $${i/.js/.min.js}; \
	done; \
	cat cliu-loader.pre.js require.js cloud-liu-loader.min.js cliu-loader.post.js > cliu-loader.min.js;

dist-copy:
	rm -rf dist
	mkdir dist
	cp -r app/static dist
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

dist-tidy: dist-uglify
	cd dist/static/js; \
	cat cliu-loader.pre.js require.js cloud-liu-loader.min.js cliu-loader.post.js > cliu-loader.min.js

	cd dist; \
	rm $(UNEEDED_FILES);

	#cd dist; \
	#for i in $(NEED_GZIP); do \
	#  gzip $$i; \
	#  mv $$i.gz $$i; \
	#done


dist: dist-tidy
	#s3fs cloudliu mnt -o ahbe_conf=S3_HTTP_Header.conf -o default_acl=public-read
	#rsync -av dist/* mnt
	echo 'done'
