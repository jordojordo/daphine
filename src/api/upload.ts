// import type { Request, Response } from 'express';

// export const createUpload = (req: Request, res: Response) => {
// 	if ( !req.files || Object.keys(req.files).length === 0 ) {
// 		return res.status(400).send('No files were uploaded.');
// 	}

// 	console.log(req.files);

// 	for ( const key of Object.keys(req.files) ) {
// 		const uploadPath = `./assets/files/${ req.files[key].name }`;

// 		req.files[key].mv(uploadPath, (err) => {
// 			if ( err ) {
// 				return res.status(500).send(err);
// 			}

// 			res.send('File uploaded.');
// 		});
// 	}


// };
