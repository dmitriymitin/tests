import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import s from './ContextMenuWrapper.module.scss';
import gs from '../../../GlobalStyles.module.scss';
import clsx from 'clsx';

interface IContextMenu {
  position: { x: number; y: number };
  onClose: () => void;
  text: React.ReactNode;
  menuRef: React.RefObject<HTMLDivElement>;
  isClosing: boolean;
}

const ContextMenu = ({position, onClose, text, menuRef, isClosing}: IContextMenu) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => {
      setIsVisible(false);
    };
  }, []);

  const handleMouseEnter = () => {
    clearTimeout((window as any).menuTimeout);
  };

  const handleMouseLeave = () => {
    (window as any).menuTimeout = setTimeout(onClose, 500);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    event.stopPropagation();
  };

  const handleClick = (event: React.MouseEvent) => {
    // Тут можно добавить логику обработки клика, если нужно
  };

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      className={clsx(s.contextMenuStyle, gs.adminFunctionBlock, {
        [s.open]: isVisible && !isClosing,
        [s.close]: isClosing
      })}
      style={{
        minWidth: 200,
        top: `calc(${position.y}px + 20px)`,
        left: `calc(${position.x}px - 150px)`,
        animationName: 'fadeInUp'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      {text}
    </div>,
    document.body
  );
};

interface IContextMenuWrapper {
  children: React.ReactNode;
  text?: React.ReactNode;
  isFullWidth?: boolean;
}

const ContextMenuWrapper = ({children, text, isFullWidth = true}: IContextMenuWrapper) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
  const [isClosing, setIsClosing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const touchTimer = useRef<number>();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!showMenu) { return; }

      if (!wrapperRef.current || !menuRef.current) { return; }

      if (!menuRef.current.contains(event.target as Node) && !wrapperRef.current.contains(event.target as Node)) {
        setIsClosing(true);
        setTimeout(() => {
          setShowMenu(false);
          setIsClosing(false);
        }, 300); // Длительность анимации закрытия должна совпадать с CSS-анимацией
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showMenu]);

  const handleLongPress = (event: React.TouchEvent) => {
    if (menuRef.current && menuRef.current.contains(event.target as Node)) {
      // Если начало долгого нажатия внутри контекстного меню, блокируем его повторное открытие
      event.stopPropagation();
      return;
    }

    event.preventDefault();
    touchTimer.current = window.setTimeout(() => {
      setShowMenu(true);
      setMenuPosition({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      });
      setTimeout(() => {
        setIsClosing(false); // Убедитесь, что состояние анимации открытия корректно обновляется
      }, 0); // Немедленно после открытия меню
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    if (showMenu) {
      event.preventDefault(); // Предотвратить повторное открытие, но разрешить стандартные действия браузера
    } else {
      event.preventDefault();
      setShowMenu(true);
      setMenuPosition({
        x: event.clientX,
        y: event.clientY
      });
      setTimeout(() => {
        setIsClosing(false); // Убедитесь, что состояние анимации открытия корректно обновляется
      }, 0); // Немедленно после открытия меню
    }
  };

  return (
    <div ref={wrapperRef} onTouchStart={handleLongPress} onTouchEnd={handleTouchEnd} onContextMenu={handleContextMenu}
         style={{position: 'relative', display: 'inline-block', width: isFullWidth ? '100%' : 'max-content'}}>
      <div>
        {children}
      </div>
      {showMenu && (
        <ContextMenu
          position={menuPosition}
          onClose={() => {
            setIsClosing(true);
            setTimeout(() => {
              setShowMenu(false);
              setIsClosing(false);
            }, 300); // Длительность анимации закрытия должна совпадать с CSS-анимацией
          }}
          text={text}
          menuRef={menuRef}
          isClosing={isClosing}
        />
      )}
    </div>
  );
};

export default ContextMenuWrapper;
