import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'djgzhzvh3',
  api_key: '516714766733369',
  api_secret: 'lAge_4JcHmwQieDHQo0QUJYUS8c',
})

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
