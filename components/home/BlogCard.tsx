import React from "react";
import type { Blog } from "./blog.types";
import { Calender } from "../svg";
import Link from "next/link";

type BlogCardProps = {
  list?: Blog[];
};

const BlogCard = ({ list = [] }: BlogCardProps) => {
  return (
    <>
      {list.map((blog) => (
        <Link href={`/blog/${blog.title}`} className="blogCard w-full md:w-[calc(50%-32px)] lg:w-[calc(25%-32px)] group" key={blog.id}>
          <div className="blogImage aspect-square overflow-hidden rounded-[10px]"><img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-all" /></div>
          <div className="blogDate flex items-center gap-2 mt-6 mb-4 subBody font-medium font-jakarta text-[#0D0D0D]"><Calender /><p>{blog.date}</p></div>
          <div className="blogTitle text-[#0D0D0D] body font-medium font-jakarta"><h5>{blog.title}</h5></div>
        </Link>
      ))}
    </>
  );
};

export default BlogCard;
