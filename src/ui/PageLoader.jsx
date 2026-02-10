import CircleLoader from './CircleLoader';

export default function PageLoader({
  label = 'Loading…',
  subLabel = 'Please wait a moment...',
  titleStyle = '',
  subtitleStyle = '',
  circleStyle = '',
  size = 44,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[0.8px] bg-white/5">
      <div className="flex flex-col items-center gap-4">
        <CircleLoader size={size} circleStyle={circleStyle} />

        <div className={`text-center flex flex-col gap-1 mt-2 items-center`}>
          <p className={` font-medium text-gray-700 ${titleStyle}`}>{label}</p>
          <p className={`text-sm text-gray-500 ${subtitleStyle}`}>{subLabel}</p>
        </div>
      </div>
    </div>
  );
}
