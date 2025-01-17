import { useState } from "react";
import { Button } from "../common/Button";
import { CreatePlanModal } from "../common/Modal/CreatePlanModal";
import styles from "./PlanCard.module.scss";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";
import { Confirm } from "../common/Confirm";
import { Toast } from "../common/Toast";
import { createRoot } from "react-dom/client";
import { ExportTemplate } from "./ExportTemplate";

export const PlanCard = ({ plan, onUpdate, onDelete, onAbandon }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  /**
   * @description 导出方案为图片
   */
  const handleExportImage = async () => {
    try {
      // 创建临时容器
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      document.body.appendChild(container);

      // 渲染导出模板
      const root = createRoot(container);
      root.render(<ExportTemplate plan={plan} />);

      // 等待图片加载完成
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 导出为图片
      const canvas = await html2canvas(container, {
        backgroundColor: null,
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = `${plan.name}-行程方案.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      // 清理临时容器
      root.unmount();
      document.body.removeChild(container);

      Toast.success("方案已导出为图片");
    } catch (error) {
      Toast.error("导出图片失败，请重试");
      console.error("导出图片失败:", error);
    }
  };

  /**
   * @description 计算行程时长
   * @param {string} departureTime - 出发时间
   * @param {string} arrivalTime - 到达时间
   * @returns {string} - 时长
   */
  const calculateDuration = (departureTime, arrivalTime) => {
    const start = new Date(departureTime);
    const end = new Date(arrivalTime);
    const duration = end - start;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}小时${minutes}分钟`;
  };

  /**
   * @description 格式化城市名称
   * @param {string} cityLabel - 城市名称
   * @returns {string} - 格式化后的城市名称
   */
  const formatCityName = (cityLabel) => {
    if (!cityLabel) return "";
    const parts = cityLabel.split(" / ");
    return parts[parts.length - 1].replace(/[省市区]$/, "");
  };

  /**
   * @description 计算行程总时长
   * @param {Array} segments - 行程段
   * @returns {string} - 总时长
   */
  const calculateTotalDuration = (segments) => {
    let totalMinutes = 0;

    segments.forEach((segment) => {
      const start = new Date(segment.departureTime);
      const end = new Date(segment.arrivalTime);
      const duration = end - start;
      totalMinutes += duration / (1000 * 60); // 转换为分钟
    });

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = Math.floor(totalMinutes % 60);

    if (days > 0) {
      return `${days}天${hours}小时${minutes}分钟`;
    }
    return `${hours}小时${minutes}分钟`;
  };

  /**
   * @description 计算行程总费用
   * @param {Array} segments - 行程段
   * @returns {number} - 总费用
   */
  const calculateTotalCost = (segments) => {
    return segments.reduce((total, segment) => {
      const price = Number(segment.price) || 0;
      const hotelPrice = segment.needAccommodation
        ? Number(segment.hotelPrice) || 0
        : 0;
      return total + price + hotelPrice;
    }, 0);
  };

  /**
   * @description 删除方案
   */
  const handleDelete = async () => {
    const confirmed = await Confirm.show({
      title: "删除确认",
      content: "确定要删除该方案吗？删除后将无法恢复。",
      type: "warning",
    });

    if (confirmed) {
      onDelete(plan.id);
      Toast.success("方案已删除");
    }
  };

  /**
   * @description 放弃或恢复方案
   */
  const handleAbandon = async () => {
    const isAbandoned = plan.abandoned;
    const confirmed = await Confirm.show({
      title: isAbandoned ? "恢复确认" : "放弃确认",
      content: isAbandoned ? "确定要恢复该方案吗？" : "确定要放弃该方案吗？",
      type: isAbandoned ? "warning" : "warning",
      confirmText: isAbandoned ? "恢复" : "放弃",
    });

    if (confirmed) {
      onAbandon(plan.id);
      Toast.success(isAbandoned ? "方案已恢复" : "方案已放弃");
    }
  };

  return (
    <>
      <div
        className={`${styles.card} ${plan.abandoned ? styles.abandoned : ""}`}
        id={`plan-${plan.id}`}
      >
        <div className={styles.header}>
          <div className={styles.title}>
            <h3>{plan.name}</h3>
            <span>{new Date(plan.createdAt).toLocaleDateString("zh-CN")}</span>
            {plan.abandoned && <div className={styles.status}>已放弃</div>}
          </div>
          <div className={styles.actions}>
            <Button
              variant="text"
              icon="ri-edit-line"
              onClick={() => setShowEditModal(true)}
              disabled={plan.abandoned}
            />
            <Button
              variant="text"
              icon="ri-download-line"
              onClick={handleExportImage}
            />
            <Button
              variant="text"
              icon="ri-delete-bin-line"
              onClick={handleDelete}
            />
            <Button
              variant="text"
              icon={plan.abandoned ? "ri-refresh-line" : "ri-close-circle-line"}
              onClick={handleAbandon}
            />
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.segments}>
            {plan.segments.map((segment, index) => (
              <div key={index} className={styles.segment}>
                <div className={styles.time}>
                  <div className={styles.timePoint}>
                    <span className={styles.hour}>
                      {new Date(segment.departureTime).toLocaleTimeString(
                        "zh-CN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                    <span className={styles.date}>
                      {new Date(segment.departureTime).toLocaleDateString(
                        "zh-CN"
                      )}
                    </span>
                  </div>
                  <div className={styles.duration}>
                    {calculateDuration(
                      segment.departureTime,
                      segment.arrivalTime
                    )}
                  </div>
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
                  </div>
                  <div className={styles.arrow}>
                    {segment.transitType !== "direct" && (
                      <span className={styles.transit}>
                        {segment.transitType === "transit" ? "中转" : "经停"}:
                        {formatCityName(segment.transitCityLabel)}
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
                  </div>
                </div>

                <div className={styles.info}>
                  <div className={styles.transport}>
                    {segment.carrier} {segment.flightNo || segment.trainNo}
                  </div>
                  <div className={styles.price}>
                    ¥{Number(segment.price).toLocaleString()}
                    {segment.needAccommodation && (
                      <span className={styles.hotel}>
                        + 住宿 ¥{Number(segment.hotelPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.item}>
              <label>总时长</label>
              <span>{calculateTotalDuration(plan.segments)}</span>
            </div>
            <div className={styles.item}>
              <label>总费用</label>
              <span>
                ¥ {calculateTotalCost(plan.segments).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <CreatePlanModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedPlan) => {
            onUpdate({
              ...updatedPlan,
              id: plan.id,
              createdAt: plan.createdAt,
            });
            setShowEditModal(false);
          }}
          initialData={plan}
        />
      )}
    </>
  );
};

PlanCard.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    segments: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAbandon: PropTypes.func.isRequired,
};
