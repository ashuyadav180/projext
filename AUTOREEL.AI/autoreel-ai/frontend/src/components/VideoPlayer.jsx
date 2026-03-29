const VideoPlayer = ({ videoUrl }) => {
  if (!videoUrl) return null;

  return (
    <div style={{ marginTop: "25px", textAlign: "center" }}>
      <video
        src={videoUrl}
        controls
        autoPlay
        loop
        style={{
          width: "100%",
          maxWidth: "360px",
          borderRadius: "14px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
};

export default VideoPlayer;
