import { resolve } from 'path';
import { Configuration } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const outDir = resolve(__dirname, 'build');

const config: Configuration = {
	mode: 'development',
	entry: './src/index.ts',
	devtool: 'source-map',
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
		new CopyPlugin({
			patterns: [
				{
					from: 'static/manifest.dev.json',
					to: 'manifest.json',
				},
				{ from: 'static/assets/*', to: '[name][ext]' },
				{ from: 'src/index.css', to: 'content.css' },
			],
		}),
		new ForkTsCheckerWebpackPlugin({
			async: false,
			issue: {
				exclude: { origin: 'eslint', severity: 'warning' },
			},
			eslint: {
				files: './src/**/*.{ts,tsx}',
			},
			typescript: {
				configFile: 'tsconfig.dev.json',
			},
		}),
	],
	watch: true,
};

export default config;
