import Image from "next/image";
import { motion } from "framer-motion";

const CloseBtn = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="bg-black rounded-full"
    >
      <Image src="/common/cross.svg" width={30} height={30} alt="img" />
    </motion.button>
  );
};

export default CloseBtn;