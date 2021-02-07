import pkg from "./package.json";
import typescript from "rollup-plugin-typescript2";

export default {
    input: './src_app/app.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
        }
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
        })
    ]
};