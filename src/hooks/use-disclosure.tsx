import { useState } from "react";

export type StateType = [boolean, () => void, () => void, () => void] & {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  onSetOpen: (value: boolean) => void;
};

/**
 *
 * @param initialState - boolean
 * @returns An array like object with `state`, `open`, `close`, and `toggle` properties
 *  to allow both object and array destructuring
 *
 * ```
 *  const [showModal, openModal, closeModal, toggleModal] = useToggleState()
 *  // or
 *  const { isOpen, onOpen, close, toggle } = useToggleState()
 * ```
 */

const useDisclosure = (initialState = false) => {
  const [state, setState] = useState<boolean>(initialState);

  const onClose = () => {
    setState(false);
  };

  const onOpen = () => {
    setState(true);
  };

  const onToggle = () => {
    setState((state) => !state);
  };

  const onSetOpen = (value: boolean) => {
    setState(value);
  };

  const hookData = [state, onOpen, onClose, onToggle] as StateType;
  hookData.isOpen = state;
  hookData.onOpen = onOpen;
  hookData.onClose = onClose;
  hookData.onToggle = onToggle;
  hookData.onSetOpen = onSetOpen;
  return hookData;
};

export default useDisclosure;
