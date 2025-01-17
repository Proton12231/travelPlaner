import { useState } from "react";
import { Modal } from "../../index";
import { Input } from "../../../Input";
import { Button } from "../../../Button";
import { SegmentForm } from "../SegmentForm";
import styles from "./CreatePlan.module.scss";
import PropTypes from "prop-types";

export const CreatePlan = ({ onSave, onCancel, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    segments: [],
    ...(initialData || {}),
  });
  const [showSegmentForm, setShowSegmentForm] = useState(false);
  const [editingSegment, setEditingSegment] = useState(null);

  const calculateTotalDuration = () => {
    if (form.segments.length === 0) return "0小时0分钟";

    let totalMinutes = 0;
    form.segments.forEach((segment) => {
      const start = new Date(segment.departureTime);
      const end = new Date(segment.arrivalTime);
      totalMinutes += (end - start) / (1000 * 60);

      if (segment.transitType !== "direct") {
        const transitStart = new Date(segment.transitDepartureTime);
        const transitEnd = new Date(segment.transitArrivalTime);
        totalMinutes += (transitEnd - transitStart) / (1000 * 60);
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours}小时${minutes}分钟`;
  };

  const calculateTotalCost = () => {
    if (form.segments.length === 0) return 0;

    return form.segments.reduce((total, segment) => {
      let segmentCost = Number(segment.price) || 0;
      if (segment.needAccommodation) {
        segmentCost += Number(segment.hotelPrice) || 0;
      }
      return total + segmentCost;
    }, 0);
  };

  const calculateDuration = (departureTime, arrivalTime) => {
    const start = new Date(departureTime);
    const end = new Date(arrivalTime);
    const duration = end - start;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}小时${minutes}分钟`;
  };

  const handleSaveSegment = (segmentData) => {
    if (editingSegment?.index !== undefined) {
      const newSegments = [...form.segments];
      newSegments[editingSegment.index] = segmentData;
      setForm({ ...form, segments: newSegments });
    } else {
      setForm({ ...form, segments: [...form.segments, segmentData] });
    }
    setShowSegmentForm(false);
    setEditingSegment(null);
  };

  const formatCityName = (cityLabel) => {
    if (!cityLabel) return "";
    const parts = cityLabel.split(" / ");
    return parts[parts.length - 1].replace(/[省市区]$/, "");
  };

  return (
    <>
      <Modal isOpen={true} onClose={onCancel} title="创建方案" width="800px">
        <div className={styles.form}>
          <Input
            label="方案名称"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="请输入方案名称"
          />

          <div className={styles.segments}>
            <div className={styles.header}>
              <h3>行程列表</h3>
              <Button onClick={() => setShowSegmentForm(true)}>添加行程</Button>
            </div>

            {form.segments.length === 0 ? (
              <div className={styles.empty}>
                <i className="ri-route-line" />
                <p>暂无行程，点击"添加行程"开始规划您的旅程</p>
              </div>
            ) : (
              <>
                <div className={styles.list}>
                  {form.segments.map((segment, index) => (
                    <div key={index} className={styles.segment}>
                      <div className={styles.mainInfo}>
                        <div className={styles.time}>
                          <div className={styles.timePoint}>
                            <span className={styles.hour}>
                              {new Date(
                                segment.departureTime
                              ).toLocaleTimeString("zh-CN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span className={styles.date}>
                              {new Date(
                                segment.departureTime
                              ).toLocaleDateString("zh-CN")}
                            </span>
                          </div>
                          <span className={styles.duration}>
                            {calculateDuration(
                              segment.departureTime,
                              segment.arrivalTime
                            )}
                          </span>
                          <div className={styles.timePoint}>
                            <span className={styles.hour}>
                              {new Date(segment.arrivalTime).toLocaleTimeString(
                                "zh-CN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                            <span className={styles.date}>
                              {new Date(segment.arrivalTime).toLocaleDateString(
                                "zh-CN"
                              )}
                            </span>
                          </div>
                        </div>

                        <div className={styles.route}>
                          <div className={styles.city}>
                            <span className={styles.name}>
                              {formatCityName(segment.fromLabel)}
                            </span>
                            <span className={styles.code}>
                              {segment.fromLabel.split(" / ")[0]}
                            </span>
                          </div>
                          <div className={styles.arrow}>
                            {segment.transitType !== "direct" && (
                              <span className={styles.transit}>
                                {segment.transitType === "transit"
                                  ? "中转"
                                  : "经停"}
                                :{formatCityName(segment.transitCityLabel)}
                                {segment.transitDuration &&
                                  ` (${segment.transitDuration})`}
                              </span>
                            )}
                            <i className="ri-arrow-right-line" />
                          </div>
                          <div className={styles.city}>
                            <span className={styles.name}>
                              {formatCityName(segment.toLabel)}
                            </span>
                            <span className={styles.code}>
                              {segment.toLabel.split(" / ")[0]}
                            </span>
                          </div>
                        </div>

                        <div className={styles.transport}>
                          <div className={styles.number}>
                            {segment.carrier}
                            {segment.flightNo || segment.trainNo}
                          </div>
                        </div>
                      </div>

                      <div className={styles.subInfo}>
                        <div className={styles.tags}>
                          {segment.transitType !== "direct" && (
                            <span className={`${styles.tag} ${styles.transit}`}>
                              {segment.transitType === "transit"
                                ? "中转"
                                : "经停"}
                            </span>
                          )}
                          {segment.needAccommodation && (
                            <span className={`${styles.tag} ${styles.hotel}`}>
                              住宿: {segment.hotel}
                            </span>
                          )}
                        </div>
                        <div className={styles.price}>
                          ¥{Number(segment.price).toLocaleString()}
                          {segment.needAccommodation &&
                            ` + ¥${Number(
                              segment.hotelPrice
                            ).toLocaleString()}`}
                        </div>
                      </div>

                      <div className={styles.actions}>
                        <Button
                          variant="text"
                          icon="ri-edit-line"
                          onClick={() => {
                            setEditingSegment({ ...segment, index });
                            setShowSegmentForm(true);
                          }}
                        />
                        <Button
                          variant="text"
                          icon="ri-delete-bin-line"
                          onClick={() => {
                            const newSegments = [...form.segments];
                            newSegments.splice(index, 1);
                            setForm({ ...form, segments: newSegments });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.summary}>
                  <div className={styles.item}>
                    <label>总时长</label>
                    <span>{calculateTotalDuration()}</span>
                  </div>
                  <div className={styles.item}>
                    <label>总费用</label>
                    <span>¥ {calculateTotalCost().toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={styles.footer}>
            <Button variant="text" onClick={onCancel}>
              取消
            </Button>
            <Button
              variant="primary"
              onClick={() => onSave(form)}
              disabled={!form.name || form.segments.length === 0}
            >
              保存
            </Button>
          </div>
        </div>
      </Modal>

      {showSegmentForm && (
        <SegmentForm
          data={editingSegment || {}}
          onSave={handleSaveSegment}
          onCancel={() => {
            setShowSegmentForm(false);
            setEditingSegment(null);
          }}
        />
      )}
    </>
  );
};

CreatePlan.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};
