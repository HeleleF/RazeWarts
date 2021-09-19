/**
 * This declaration allows us to import .png files directly into our code. Isn't that crazy? 🤯
 */
declare module '*.png' {
	const value: string;
	export default value;
}
