import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";

export default function Modal({ setIsOpen, isOpen, next }: any) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function handleSubmit(password: string) {
    if (password.length > 0) {
      next(password);
      closeModal();

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } p-4 border bg-[#202028]/20 backdrop-blur-xl border-[#4a4a4a]/10 shadow-lg rounded-lg pointer-events-auto flex flex-row items-center`}
        >
          <div className="flex flex-row items-center opacity-50">
            <p className="text-sm">password set</p>
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
            <p className="text-sm">please enter a password</p>
          </div>
        </div>
      ));
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <form className="fixed inset-0">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg glassmorphism p-7 text-left align-middle shadow-xl transition-all">
                <form>
                  <div className="flex flex-col">
                    <label className="relative block mt-2">
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="password"
                        maxLength={50}
                        type={showPassword ? "text" : "password"}
                        aria-label="Password"
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
                    onClick={() => handleSubmit(password)}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-white/5 w-full mt-3 bg-[#000]/40 text-[#fff] text-xs text-opacity-80 rounded-lg px-6 py-3"
                  >
                    submit
                  </motion.button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </form>
      </Dialog>
    </Transition>
  );
}