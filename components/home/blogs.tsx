import React from "react";
import BadgeTitle from "../BadgeTitle";
import BlogCard from "./BlogCard";
import type { Blog } from "./blog.types";

const blogs: Blog[] = [
  {
    id: 1,
    title: "Online Divorce: Can You Do It? Forms & Steps",
    date: "23 Jul, 2025",
    imageUrl: "/blog1.png",
  },
  {
    id: 2,
    title: "Immigration Letter of Support for a Family Member — Sample Letter",
    date: "16 Aug, 2025",
    imageUrl: "/blog2.png",
  },
  {
    id: 3,
    title: "Confidentiality and Invention Assignment Agreement Template",
    date: "23 Jul, 2025",
    imageUrl: "/blog3.png",
  },
  {
    id: 4,
    title: "Cloud Service Agreement",
    date: "18 Mar, 2025",
    imageUrl: "/blog4.png",
  },
];

const BlogSec = () => {
  return (
    <section id="blogs" className="commonGap bg-[#FFFBF2]">
      <div className="sub-wrapper mx-auto px-4">
        <BadgeTitle
          badge="Blogs"
          title="Your daily dose of insight & Inspiration"
          className="text-center"
        />

        <div className="blogCards flex flex-wrap justify-center gap-8 my-16">
          <BlogCard list={blogs} />
        </div>

        <div><button className="text-white bg-(--btn-bg) shadow-[0px_4.273px_12.819px_-4.273px_#789DF6] font-medium bodySub py-3.5 px-10 rounded-full mx-auto block cursor-pointer">View All</button></div>
      </div>
    </section>
  );
};

export default BlogSec;
