import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faEdit,
  faPlus,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { classes } from '../../utils';
import { Button } from '..';
import './stylesheet.scss';

export default function Select({ className, value, options }) {
  const [opened, setOpened] = useState(false);
  const [inputIndex, setInputIndex] = useState('');
  const [inputting, setInputting] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    setOpened(inputting);
  }, [inputting]);

  const optionsObtained = options;
  const selectedOption = optionsObtained.find(
    (option) => option.innerValue === currentValue
  );
  const label = selectedOption ? selectedOption.innerLabel : '-';
  const handleInputChange = (e) => {
    const input = e.target.value.trim();
    setInputValue(`${input}`);
  };
  const handleKeyDown = (innerValue, iconsAndFunctions, index, e) => {
    if (e.key === 'Enter') {
      if (inputValue === '') {
        setInputValue('Blank');
      }
      if (iconsAndFunctions.functions.edit(inputValue)) {
        setCurrentValue(
          innerValue === currentValue ? inputValue : currentValue
        );
        optionsObtained[index].innerValue = inputValue;
        optionsObtained[index].innerLabel = inputValue;
      }
      setInputting(false);
      setInputIndex('');
    }
  };

  return (
    <div
      className={classes('Button', 'Select', className)}
      onClick={() => (!inputting ? setOpened(!opened) : setOpened(true))}
    >
      <div className="text">{label}</div>
      <FontAwesomeIcon fixedWidth icon={faCaretDown} />
      {opened && (
        <div
          className="intercept"
          onClick={() => (!inputting ? setOpened(false) : setOpened(true))}
        />
      )}
      {opened && (
        <div className="option-container">
          {optionsObtained.map(
            (
              {
                innerValue,
                innerLabel,
                onClick,
                iconsAndFunctions = { icons: [], functions: {} }
              },
              index
            ) => (
              <div className="option" key={innerValue + innerLabel}>
                {inputting && inputIndex === innerValue ? (
                  <input
                    /* eslint-disable-next-line jsx-a11y/no-autofocus */
                    autoFocus
                    className="option-input"
                    type="text"
                    key={`input${innerValue}`}
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={innerValue}
                    onKeyDown={(e) => {
                      handleKeyDown(innerValue, iconsAndFunctions, index, e);
                    }}
                  />
                ) : (
                  <Button
                    className="option-text"
                    key={innerValue}
                    onClick={() => onClick(innerValue)}
                  >
                    {iconsAndFunctions.icons.includes('add') ? (
                      <FontAwesomeIcon fixedWidth icon={faPlus} />
                    ) : null}
                    {innerLabel}
                  </Button>
                )}
                {iconsAndFunctions.icons.includes('edit') ? (
                  <Button
                    key={`${innerValue}edit`}
                    className="option-button"
                    onClick={(e) => {
                      if (innerValue === inputIndex) {
                        if (inputValue === '') {
                          setInputValue('Blank');
                        }
                        if (iconsAndFunctions.functions.edit(inputValue)) {
                          setCurrentValue(
                            innerValue === currentValue
                              ? inputValue
                              : currentValue
                          );
                          optionsObtained[index].innerValue = inputValue;
                          optionsObtained[index].innerLabel = inputValue;
                        }
                        setInputting(false);
                        setInputIndex('');
                      } else {
                        setInputValue(innerValue);
                        setInputting(true);
                        setInputIndex(innerValue);
                        e.stopPropagation();
                      }
                    }}
                  >
                    <FontAwesomeIcon fixedWidth icon={faEdit} />
                  </Button>
                ) : null}
                {iconsAndFunctions.icons.includes('delete') ? (
                  <Button
                    key={`${innerValue}delete`}
                    className="option-button"
                    onClick={() => iconsAndFunctions.functions.delete()}
                  >
                    <FontAwesomeIcon fixedWidth icon={faTrashAlt} />
                  </Button>
                ) : null}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
