// import {defineEventHandler, readBody} from 'h3';
// import * as blogModel from '~~/server/model/blog';

// export default defineEventHandler(async (event) => {
//     const body = await readBody(event);

//     for (const record of body.records) {
//         await blogModel.create({
//             temperature: record.temperature,
//             humidity: record.humidity,
//         });
//     }

//     return {message: 'Data Saved Successfuly'};
// }); 