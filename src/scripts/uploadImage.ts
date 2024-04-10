import { v2 as cloudinary } from 'cloudinary'

const run = () => {
  cloudinary.uploader.upload(
    'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
    { public_id: 'olympic_flag' },
    function (error, result) {
      console.log(result)
    }
  )
}

run()
export { run }
