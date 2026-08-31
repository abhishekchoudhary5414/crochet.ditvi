import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button/Button";
import styles from "./blog.module.css";

const featuredPost = {
  title: "The Story Behind Every Handmade Stitch",
  category: "Craft Journal",
  readTime: "6 min read",
  description:
    "From cozy totes to florals that never wilt, discover how slow, thoughtful crochet work turns simple yarn into treasured daily pieces.",
  image:
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
};

import blogs from "@/data/blogs.json";

const blogPosts = blogs;

export default function BlogPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <span className={styles.kicker}>Ditvi Crochet Journal</span>
          <h1 className={styles.title}>Stories, inspiration, and behind-the-stitches moments</h1>
          <p className={styles.subtitle}>
            Discover thoughtful ideas, handmade stories, and cozy lifestyle inspiration from the Ditvi Crochet studio.
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <section className={styles.featuredCard}>
          <div className={styles.featuredImageWrap}>
            <Image
              src={blogPosts[0].image}
              alt={blogPosts[0].title}
              className={styles.featuredImage}
              width={1200}
              height={700}
            />
          </div>
          <div className={styles.featuredContent}>
            <span className={styles.featuredLabel}>{blogPosts[0].category}</span>
            <h2 className={styles.featuredTitle}>{blogPosts[0].title}</h2>
            <p className={styles.featuredMeta}>{blogPosts[0].date} • {blogPosts[0].readTime}</p>
            <p className={styles.featuredDescription}>{blogPosts[0].excerpt}</p>
            <Link href={blogPosts[0].href ?? '/blog'}>
              <Button variant="primary" size="md">Read the story</Button>
            </Link>
          </div>
        </section>

        <section className={styles.gridSection}>
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className={styles.postCard}>
              <div className={styles.postImageWrap}>
                <Image src={post.image} alt={post.title} className={styles.postImage} width={800} height={500} />
              </div>
              <div className={styles.postBody}>
                <div className={styles.metaRow}>
                  <span className={styles.category}>{post.category}</span>
                  <span className={styles.readTime}>{post.date} • {post.readTime}</span>
                </div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <Link href={post.href ?? '/blog'} className={styles.readMore}>Read article</Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
