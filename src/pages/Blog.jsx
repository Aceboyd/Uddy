import React, { useState, useEffect } from "react";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const apiKey = "pub_5dc2e140252149a0b969b4549951789b"; // ✅ Your API key
        const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=fashion+tips+trends&language=en`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("Failed to fetch blogs");

        const data = await res.json();

        if (data.results) {
          const posts = data.results.slice(0, 3).map((article, index) => ({
            id: index.toString(),
            title: article.title,
            image: article.image_url,
            excerpt: article.description || "No description available",
            content: article.content || "",
            url: article.link,
          }));
          setBlogPosts(posts);
        } else {
          setError("No fashion tips & trends found.");
        }
      } catch (err) {
        setError("Error fetching fashion tips & trends.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="py-4 sm:py-6 text-center">
        <h1 className="text-xl sm:text-4xl font-bold tracking-wide henny-penny text-pink-600">
          Blog
        </h1>
      </header>

      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
            Fashion Tips & Trends
          </h2>

          {loading && <p className="text-center text-gray-500">Loading fashion tips & trends...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* ✅ Fixed to show only 3 in a row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-60 object-cover"
                  />
                )}
                <div className="p-1 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-2 line-clamp-5">
                    {post.excerpt}
                  </p>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:underline text-sm sm:text-base font-medium"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
