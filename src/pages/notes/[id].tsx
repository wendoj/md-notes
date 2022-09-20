import { getNotes, getNote } from "../../lib/notes";
import Head from "next/head";
import { remark } from "remark";
import html from "remark-html";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";

type Props = {
  note: {
    title: string;
    content: string;
    password: string | null;
  };
  content: string;
};

export default function NotePage({ note, content }: Props) {
  return (
    <>
      <Head>
        <title>{note.title}</title>
        <meta
          name="description"
          content="Save notes in markdown format to share with others!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="dark:bg-[#101013] max-w-[800px] py-[40px] container-fluid prose-neutral prose dark:prose-invert overflow-x-hidden">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const notes = await getNotes();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const paths = notes.map((note) => ({
    params: { id: note.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const res = await getNote(Number(params.id));
  const data = JSON.parse(JSON.stringify(await res));

  const matterResult = matter(data.content);
  const processedContent = await remark()
    .use(remarkParse)
    .use(remarkGfm)
    .use(html)
    .process(matterResult.content);
  const content = processedContent.toString();

  return {
    props: {
      note: data,
      content,
    },
  };
}