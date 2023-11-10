import { ReactNode, useEffect, useState } from "react";
import { get } from "./util/http";
import BlogPosts, { BlogPost } from "./components/BlogPosts.tsx";
import fetchingImg from "./assets/data-fetching.png";
import ErrorMessage from "./components/ErrorMessage.tsx";

type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true);
      try {
        const data = await get<RawDataBlogPost[]>(
          "https://jsonplaceholder.typicode.com/posts"
        );

        const blogPosts: BlogPost[] = data.map((blogPost) => {
          return {
            id: blogPost.id,
            title: blogPost.title,
            text: blogPost.body,
          };
        });

        setFetchedPosts(blogPosts);
      } catch (error) {
        // if(error instanceof Error)
        setError((error as Error).message);
        // setError("Failed to fetch posts!");
      }

      setIsFetching(false);
    }

    fetchPosts();
  }, []);

  let content: ReactNode;

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }

  if (isFetching) {
    content = <p id="loading-fallback">Fetching posts...</p>;
  }

  return (
    <main>
      <img src={fetchingImg} alt="fetching process" />
      {content}
    </main>
  );
}

export default App;
