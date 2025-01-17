import styles from "./ExportTemplate.module.scss";
import PropTypes from "prop-types";

export const ExportTemplate = ({ plan }) => {
  const formatCityName = (cityLabel) => {
    if (!cityLabel) return "";
    const parts = cityLabel.split(" / ");
    return parts[parts.length - 1].replace(/[省市区]$/, "");
  };

  const calculateDuration = (departureTime, arrivalTime) => {
    const start = new Date(departureTime);
    const end = new Date(arrivalTime);
    const duration = end - start;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}小时${minutes}分钟`;
  };

  const calculateTotalCost = (segments) => {
    return segments.reduce((total, segment) => {
      return total + Number(segment.price) + Number(segment.hotelPrice || 0);
    }, 0);
  };

  const calculateTotalDuration = (segments) => {
    let totalMinutes = 0;
    segments.forEach((segment) => {
      const start = new Date(segment.departureTime);
      const end = new Date(segment.arrivalTime);
      totalMinutes += (end - start) / (1000 * 60);
    });

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return days > 0
      ? `${days}天${hours}小时${minutes}分钟`
      : `${hours}小时${minutes}分钟`;
  };

  return (
    <div className={styles.template}>
      <div className={styles.header}>
        <i className="ri-route-line" />
        <h1>{plan.name}</h1>
        <div className={styles.info}>
          <span>
            创建时间：{new Date(plan.createdAt).toLocaleDateString("zh-CN")}
          </span>
          <div className={styles.stats}>
            <span>
              <i className="ri-time-line" />
              {calculateTotalDuration(plan.segments)}
            </span>
            <span>
              <i className="ri-money-cny-circle-line" />¥
              {calculateTotalCost(plan.segments).toLocaleString()}
            </span>
            <span>
              <i className="ri-route-line" />
              {plan.segments.length}段行程
            </span>
          </div>
        </div>
      </div>

      <div className={styles.timeline}>
        {plan.segments.map((segment, index) => (
          <div key={index} className={styles.segment}>
            <div className={styles.timeColumn}>
              <div className={styles.time}>
                <div className={styles.point} />
                <span className={styles.hour}>
                  {new Date(segment.departureTime).toLocaleTimeString("zh-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className={styles.date}>
                  {new Date(segment.departureTime).toLocaleDateString("zh-CN")}
                </span>
              </div>
              <div className={styles.duration}>
                {calculateDuration(segment.departureTime, segment.arrivalTime)}
              </div>
              <div className={styles.time}>
                <div className={styles.point} />
                <span className={styles.hour}>
                  {new Date(segment.arrivalTime).toLocaleTimeString("zh-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className={styles.date}>
                  {new Date(segment.arrivalTime).toLocaleDateString("zh-CN")}
                </span>
              </div>
            </div>

            <div className={styles.content}>
              <div className={styles.route}>
                <div className={styles.city}>
                  {formatCityName(segment.fromLabel)}
                </div>
                {segment.transitType !== "direct" && (
                  <div className={styles.transit}>
                    <span>
                      {segment.transitType === "transit" ? "中转" : "经停"}：
                      {formatCityName(segment.transitCityLabel)}
                    </span>
                    <span className={styles.transitTime}>
                      {segment.transitDuration}
                    </span>
                  </div>
                )}
                <div className={styles.city}>
                  {formatCityName(segment.toLabel)}
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.transport}>
                  <i
                    className={`ri-${
                      segment.type === "flight" ? "flight" : "train"
                    }-line`}
                  />
                  <span>
                    {segment.carrier} {segment.flightNo || segment.trainNo}
                  </span>
                </div>
                <div className={styles.price}>
                  <span>¥{Number(segment.price).toLocaleString()}</span>
                  {segment.needAccommodation && (
                    <span className={styles.hotel}>
                      住宿：{segment.hotel}
                      <span className={styles.hotelPrice}>
                        ¥{Number(segment.hotelPrice).toLocaleString()}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.qrCode}>
          <img src="/qrcode.png" alt="QR Code" />
          <span>扫码下载 App</span>
        </div>
        <div className={styles.copyright}>
          <p>
            © {new Date().getFullYear()} Travel Planner. All rights reserved.
          </p>
          <p>让旅行更简单</p>
        </div>
      </div>
    </div>
  );
};

ExportTemplate.propTypes = {
  plan: PropTypes.shape({
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    segments: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};
