const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('del');
const browserSync = require('browser-sync').create();
const inlinesource = require('gulp-inline-source');
const webpack = require('webpack-stream');
const imagemin = require('gulp-imagemin');
const gulppug = require('gulp-pug');
const ad_conf = require('./ad_conf.js');
const rename = require("gulp-rename");

const conf = {	
	dest: './build',
	temp: './tmp'
};
let isDev, isProd;
ad_conf.scripts.type ==="dev"?conf.compress = false:conf.compress = true;
conf.compress?isDev = false:isDev = true;
isProd = !isDev;

const webpackConfig = {
	output: {
		filename: 'index.js',						
	},
	module:{
		rules:[
			{
				exclude: /node_modules/,
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}				
			},  
			{
		        test: /\.tsx?$/,
		        use: 'ts-loader',
		        exclude: /node_modules/,
		    },          
			{
				test: /\.(png|jpg|gif|mp3|svg|woff)$/i,
				use: [
					{
					  loader: 'url-loader',
					  options: {
						limit: true,
					  },
					},
				],				
			},			
		]
	},
	resolve: {
    	extensions: ['.tsx', '.ts', '.js'],
  	},
	mode: isDev ? 'development' : 'production',
	devtool: isDev ? 'eval-source-map' : false,
	optimization: {
        minimize: false
    }
};	
const cssFiles = [
	'./src/css/main.css'
];
const styles = () =>{
	return gulp.src(cssFiles)
			.pipe(concat('all.css'))			
			.pipe(gulp.dest(conf.temp + '/css'))
			.pipe(browserSync.stream());
}
const font = () =>{
	return gulp.src('./src/font/**/*')
			.pipe(gulp.dest(conf.temp + '/font'))		
}
const script = () =>{	
		return gulp.src('./src/js/main.js')
				.pipe(webpack(webpackConfig))
				.pipe(gulp.dest(conf.temp + '/js'))				
				.pipe(browserSync.stream());	
}
const images = () =>{
	return gulp.src('./src/img/**/*')	
			.pipe(imagemin([					
					imagemin.mozjpeg({quality: 75, progressive: true}),
					imagemin.optipng({optimizationLevel: 5})					
				]))
			.pipe(gulp.dest(conf.temp + '/img'))	
}
const imagesNoCompress = () =>{
	return gulp.src('./src/img/**/*')			
			.pipe(gulp.dest(conf.temp + '/img'))	
}
const audio = () =>{
	return gulp.src('./src/audio/**/*')				
			.pipe(gulp.dest(conf.temp + '/audio'))	
}
const json = () =>{
	return gulp.src('./src/json/**/*')				
			.pipe(gulp.dest(conf.temp + '/json'))	
}
const watch = () =>{
	browserSync.init({
		server:{
			baseDir:'./build'
		}
	});
	gulp.watch('./src/css/**/*.css', styles);
	gulp.watch('./src/js/**/*.js', gulp.series(script,html));	
	gulp.watch('./src/js/**/*.ts', gulp.series(script,html));	
	gulp.watch('./src/**/*.html', html);	
}
const clean = () =>{
	return	del(['build/*', 'tmp/*']);	
}
const pug = () =>{	
	return gulp.src('./src/pug/*.pug')
		.pipe(gulppug({
			options: {
				pretty: true,
			},
			data: {
				title:ad_conf.scripts.title,
				author:ad_conf.scripts.author,
				preloaderImg:ad_conf.scripts.preloaderImg,
				type:ad_conf.scripts.type,				
			}
			}))
		.pipe(gulp.dest('./tmp'))
		.pipe(browserSync.stream());	
}
const html = () =>{
	const options = {
		compress: conf.compress
	};	 
	return gulp.src('./tmp/*.html')
		.pipe(inlinesource(options))		
		.pipe(gulp.dest(conf.dest))
		.pipe(browserSync.stream());
}
let build =
	gulp.series(
		clean, 
		imagesNoCompress,
		audio,
		json,
		font,
		gulp.parallel(styles, script),
		pug,
		html
	);	
gulp.task('styles', styles);
gulp.task('script', script);
gulp.task('watch', watch);					
gulp.task('build', build);
gulp.task('dev', gulp.series('build', 'watch'));
gulp.task('ad', function(done) {
	const taskToDo=gulp.series(
		clean, 
		images,
		audio,
		json,
		font,	
		gulp.parallel(styles, script),
		pug,
		html		
	); 
    taskToDo();   
    done();
});