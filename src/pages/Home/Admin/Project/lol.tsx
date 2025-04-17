import Heading from "@/components/ui/heading";
import { AnimatePresence, motion } from "framer-motion";
import { AiFillCheckCircle } from "react-icons/ai";

const Accordion = ({
  i,
  expanded,
  setExpanded,
  question,
  answer,
}: {
  i: number;
  expanded: boolean | number;
  setExpanded: (i: number) => void;
  question: string;
  answer: string;
}) => {
  const isOpen = i === expanded;

  // By using `AnimatePresence` to mount and unmount the contents, we can animate
  // them in and out while also only rendering the contents of open accordions
  return (
    <div className={`border-0 bg-white rounded-lg`}>
      <motion.header
        initial={false}
        className={`h-[20px] w-full m-0 transition-all duration-200 cursor-pointer px-4 py-10 flex gap-4 justify-between items-center`}
        onClick={() => setExpanded(i)}
      >
        <div className="flex items-center gap-3">
          <AiFillCheckCircle />
          <Heading size="h3" className="text-[#22005D]">
            {question}
          </Heading>
        </div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            layout
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              variants={{
                collapsed: { scale: 0.8, opacity: 0 },
                open: { scale: 1, opacity: 1 },
              }}
              transition={{ duration: 0.5 }}
              className="content-placeholder"
            >
              <div className="text-[#556575] p-6 pt-0 text-md">{answer}</div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
