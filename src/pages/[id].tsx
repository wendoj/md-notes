import { getNote } from "../lib/notes";
import { remark } from "remark";
import html from "remark-html";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  note: {
    title: string;
    content: string;
    password: string | null;
  };
  content: string;
  hasPassword: boolean;
};

export default function NotePage({ note, content, hasPassword }: Props) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showContent, setShowContent] = useState(false);

  function handleSubmit(e: any) {
    e.preventDefault();

    if (note.password === password) {
      setShowContent(true);

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } p-4 border bg-[#202028]/20 backdrop-blur-xl border-[#4a4a4a]/10 shadow-lg rounded-lg pointer-events-auto flex flex-row items-center`}
        >
          <div className="flex flex-row items-center opacity-50">
            <p className="text-sm">correct password</p>
          </div>
        </div>
      ));
    } else {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } p-4 border bg-[#202028]/20 backdrop-blur-xl border-[#4a4a4a]/10 shadow-lg rounded-lg pointer-events-auto flex flex-row items-center`}
        >
          <div className="flex flex-row items-center opacity-50">
            <p className="text-sm">wrong password</p>
          </div>
        </div>
      ));
    }
  }

  if (hasPassword && !showContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="mx-4 flex flex-col items-center justify-center w-full text-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col min-w-[20rem] justify-center text-center mx-auto"
          >
            <div className="flex flex-col">
              <h1 className="mb-4 opacity-80">
                enter the password to view <strong>{note.title}</strong>
              </h1>
              <label className="relative block mt-2">
                <input
                  value={password}
                  placeholder="password"
                  maxLength={50}
                  type={showPassword ? "text" : "password"}
                  aria-label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-white/5 w-full text-xs py-3 pl-3 rounded-lg flex bg-black/10 flex-row justify-between items-center outline-none focus:ring-2 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-white/10 rounded-tr-lg rounded-br-lg absolute inset-y-0 right-0 flex items-center px-3 opacity-50"
                >
                  {showPassword ? (
                    <AiFillEye className="inline-block" />
                  ) : (
                    <AiFillEyeInvisible className="inline-block" />
                  )}
                </button>
              </label>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-white/5 w-full mt-3 bg-[#000]/40 text-[#fff] text-xs text-opacity-80 rounded-lg px-16 py-3"
            >
              submit
            </motion.button>
          </form>
        </main>
      </div>
    );
  } else {
    return (
      <>
        <main className="dark:bg-[#101013] max-w-[800px] py-[40px] container-fluid prose-neutral prose dark:prose-invert overflow-x-hidden">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </main>
      </>
    );
  }
}

export async function getServerSideProps({
  params,
}: {
  params: { id: string };
}) {
  const res = await getNote(params.id);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (res.message === "Note not found") {
    return { notFound: true };
  }

  const note = JSON.parse(JSON.stringify(await res));

  const matterResult = matter(note.content);
  const processedContent = await remark()
    .use(remarkParse)
    .use(remarkGfm)
    .use(html)
    .process(matterResult.content);
  const content = processedContent.toString();

  // Check if note has a password
  if (note.password) {
    return {
      props: {
        hasPassword: true,
        note,
        content,
      },
    };
  } else {
    return {
      props: {
        hasPassword: false,
        note,
        content,
      },
    };
  }
}