import { resolve } from 'path';
import { Configuration, ProgressPlugin } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const outDir = resolve(__dirname, 'prod');

const config: Configuration = {
	mode: 'production',
	entry: './src/index.ts',
	devtool: false,
	output: {
		path: outDir,
		filename: 'content.js',
		publicPath: '',
	},
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/i,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						presets: [
							['@babel/preset-env', { targets: { chrome: '92' } }],
							[
								'@babel/preset-react',
								{
									runtime: 'automatic',
								},
							],
							'@babel/preset-typescript',
						],
					},
				},
			},
			{
				test: /\.png/,
				type: 'asset/inline',
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [
		new ProgressPlugin(),
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: 'static/manifest.prod.json',
					to: 'manifest.json',
				},
				{ from: 'static/assets/*', to: '[name][ext]' },
				{ from: 'src/index.css', to: 'content.css' },
			],
		}),
		new ForkTsCheckerWebpackPlugin({
			async: false,
			eslint: {
				files: './src/**/*.{ts,tsx}',
			},
			typescript: {
				configFile: 'tsconfig.json',
			},
		}),
	],
	watch: false,
};

export default config;
