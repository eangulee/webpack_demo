const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');//分离CSS和JS文件 过时了
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'
const CleanWebpackPlugin = require("clean-webpack-plugin"); //去除build文件中的残余文件

module.exports = {
	devtool: devMode ? 'eval-source-map' : false,
	//“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
	entry: __dirname + "/app/main.js", //已多次提及的唯一入口文件
	output: {
		path: __dirname + "/public", //打包后的文件存放的地方
		//filename: "bundle.js" ,//打包后输出文件的文件名
		filename: "bundle-[hash].js", //-[hash]缓存
	},
	//默认是true，也可以配置一个插件覆盖默认的优化器,参考https://webpack.js.org/configuration/optimization/#optimization-minimize
	// optimization: {
	// minimize: false
	// }
	devServer: {
		contentBase: "./public", //本地服务器所加载的页面所在的目录
		historyApiFallback: true, //不跳转
		port: 8081, //端口
		inline: true, //实时刷新
		hot: true, //开启热加载
	},
	module: {
		rules: [{
				test: /(\.jsx|\.js)$/,
				use: {
					loader: "babel-loader"
					//loader: "babel-loader",//.babelrc已经配置，会自动加载
					//options: {
					//presets: [
					//"env", "react"
					//]
					// }
				},
				exclude: /node_modules/
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
		]
	},

	plugins: [
		//热加载插件
		new webpack.HotModuleReplacementPlugin(),
		new webpack.BannerPlugin('版权所有，翻版必究'), //版权申明
		new HtmlWebpackPlugin({ //依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html。这在每次生成的js文件名称不同时非常有用（比如添加了hash值）。
			template: __dirname + "/app/index.tmpl.html" //new 一个这个插件的实例，并传入相关的参数
		}),
		new webpack.optimize.OccurrenceOrderPlugin(), //为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
		// new webpack.optimize.UglifyJsPlugin(),//压缩JS代码  已过时,参考https://webpack.js.org/configuration/optimization/#optimization-minimize
		// new ExtractTextPlugin("style.css"),//分离CSS和JS文件 webpack4不能再用于css分离了
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: devMode ? '[name].css' : '[name].[hash].css',
			chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
		}),
		new CleanWebpackPlugin('build/*.*', {//去除build文件中的残余文件
			root: __dirname,
			verbose: true,
			dry: false
		}),
	]
}
