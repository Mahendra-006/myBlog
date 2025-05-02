import { Blog } from "../hooks"
import { Appbar } from "./Appbar"

export const FullBlog = ({blog}: {blog: Blog}) => {
    return <div className="min-h-screen bg-white text-black">
    <Appbar />
    <div className="flex justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full max-w-screen-xl pt-12">
        
        <div className="md:col-span-8 space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">
            {blog.title}
          </h1>
          <p className="text-sm text-gray-500">
            Posted on December 2, 2025
          </p>
          <div className="prose max-w-none text-gray-800">
            {blog.content}
          </div>
        </div>
  
        <div className="md:col-span-4">
          <div className="p-6 border rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500 mb-1">Author</p>
            <p className="text-xl font-semibold">{blog.author.name}</p>
          </div>
        </div>
  
      </div>
    </div>
  </div>
  
}