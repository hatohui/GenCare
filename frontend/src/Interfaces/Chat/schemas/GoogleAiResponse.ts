export type GoogleAiResponse =
	| {
			message: string
	  }
	| {
			error: string | unknown
	  }
