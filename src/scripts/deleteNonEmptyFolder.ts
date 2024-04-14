import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

interface Resource {
  public_id: string
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

const deleteFolderRecursive = (folderName: string) => {
  cloudinary.api.resources(
    {
      type: 'upload',
      prefix: folderName,
      max_results: 500, // Adjust max_results as needed
    },
    (error: any, result: any) => {
      if (error) {
        console.error('Error listing folder contents:', error)
        return
      }
      // Check if resources exist before attempting to iterate over them
      if (result.resources && result.resources.length > 0) {
        // Delete each resource (file) in the folder
        result.resources.forEach((resource: Resource) => {
          cloudinary.uploader.destroy(
            resource.public_id,
            (error: any, result: any) => {
              if (error) {
                console.error('Error deleting file:', error)
              } else {
                console.log('File deleted successfully:', resource.public_id)
              }
            }
          )
        })
      }

      // Recursively delete subfolders if they exist
      if (result.folders) {
        result.folders.forEach((subfolder: { name: string }) => {
          deleteFolderRecursive(subfolder.name)
        })
      }

      // Finally, delete the empty folder itself
      cloudinary.api.delete_folder(folderName, (error: any, result: any) => {
        if (error) {
          console.error('Error deleting folder:', error)
        } else {
          console.log('Folder deleted successfully:', folderName)
        }
      })
    }
  )
}

// Call the deleteFolderRecursive function with the folder name
deleteFolderRecursive('retropgf3')
