import * as express from "express";

export interface CommaSeparatedParameterListParserOptions {
	pattenrs?: (string | RegExp)[];
	excludes?: (string | RegExp)[];
}

class CommaSeparatedParameterListParser {
	private patterns: RegExp[] = [];
	private excludes: RegExp[] = [];

	constructor(options?: CommaSeparatedParameterListParserOptions) {
		if (options && options.pattenrs) {
			this.patterns = options.pattenrs.map(pattern => {
				return (typeof pattern === "string") ? new RegExp(pattern) : pattern;
			});
		}
		if (options && options.excludes) {
			this.excludes = options.excludes.map(pattern => {
				return (typeof pattern === "string") ? new RegExp(pattern) : pattern;
			});
		}
	}

	apply(req: express.Request, res: express.Response, next: express.NextFunction): any {
		Object.keys(req.query).forEach(key => {
			if (this.isTarget(key)) {
				const val = req.query[key];

				const values = (Array.isArray(val))
					? val.map(e => this.split(e))
						.reduce((acc, v) => acc.concat(v), [] as string[])
					: this.split(val);

				if (values.length === 1) {
					req.query[key] = values[0];
				} else {
					req.query[key] = values;
				}
			}
		});

		next();
	}

	private isTarget(key: string): boolean {
		if (this.patterns.length > 0) {
			if (!this.patterns.some(v => v.test(key))) {
				return false;
			}
		}
		if (this.excludes.some(v => v.test(key))) {
			return false;
		}
		return true;
	}

	private split(s: string): string[] {
		return s.split(/,/);
	}
}

export function commaSeparatedParameterListParser(options?: CommaSeparatedParameterListParserOptions): express.RequestHandler {
	const parser = new CommaSeparatedParameterListParser(options);
	return (req, res, next) => parser.apply(req, res, next);
}

export default commaSeparatedParameterListParser;
