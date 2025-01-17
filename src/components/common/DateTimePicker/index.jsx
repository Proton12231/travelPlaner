import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./DateTimePicker.module.scss";

export const DateTimePicker = ({ label, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(value ? new Date(value) : null);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onChange(newDate.toISOString());
  };

  const generateCalendarDays = () => {
    const year = date ? date.getFullYear() : new Date().getFullYear();
    const month = date ? date.getMonth() : new Date().getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const handleTimeClick = (type, value) => {
    const newDate = date || new Date();
    if (type === "hour") {
      newDate.setHours(parseInt(value));
    } else {
      newDate.setMinutes(parseInt(value));
      setTimePickerOpen(false);
      setIsOpen(false);
    }
    handleDateChange(newDate);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.selector} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.value}>
          {date ? formatDate(date) : placeholder || "请选择时间"}
        </span>
        <i className="ri-calendar-line" />
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.time}>
            <div
              className={styles.timeInput}
              onClick={() => setTimePickerOpen(!timePickerOpen)}
            >
              <span>{date ? date.toTimeString().slice(0, 5) : "00:00"}</span>
              <i className="ri-time-line" />
            </div>
            {timePickerOpen && (
              <div className={styles.timePicker}>
                <div className={styles.timeColumn}>
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={`${styles.timeOption} ${
                        date &&
                        date.getHours().toString().padStart(2, "0") === hour
                          ? styles.active
                          : ""
                      }`}
                      onClick={() => handleTimeClick("hour", hour)}
                    >
                      {hour}
                    </div>
                  ))}
                </div>
                <div className={styles.timeColumn}>
                  {minutes.map((minute) => (
                    <div
                      key={minute}
                      className={`${styles.timeOption} ${
                        date &&
                        date.getMinutes().toString().padStart(2, "0") === minute
                          ? styles.active
                          : ""
                      }`}
                      onClick={() => handleTimeClick("minute", minute)}
                    >
                      {minute}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={styles.header}>
            <button
              onClick={() => {
                const newDate = date || new Date();
                handleDateChange(
                  new Date(newDate.setMonth(newDate.getMonth() - 1))
                );
              }}
            >
              <i className="ri-arrow-left-s-line" />
            </button>
            <span>
              {date
                ? date.toLocaleString("zh-CN", {
                    year: "numeric",
                    month: "long",
                  })
                : new Date().toLocaleString("zh-CN", {
                    year: "numeric",
                    month: "long",
                  })}
            </span>
            <button
              onClick={() => {
                const newDate = date || new Date();
                handleDateChange(
                  new Date(newDate.setMonth(newDate.getMonth() + 1))
                );
              }}
            >
              <i className="ri-arrow-right-s-line" />
            </button>
          </div>
          <div className={styles.calendar}>
            <div className={styles.weekdays}>
              {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                <div key={day} className={styles.weekday}>
                  {day}
                </div>
              ))}
            </div>
            <div className={styles.days}>
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`${styles.day} ${
                    day &&
                    date &&
                    day.getDate() === date.getDate() &&
                    day.getMonth() === date.getMonth()
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => day && handleDateChange(day)}
                >
                  {day ? day.getDate() : ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DateTimePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
