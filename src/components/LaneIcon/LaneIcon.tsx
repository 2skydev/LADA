import clsx from 'clsx';

export interface LaneIconProps {
  className?: string;
  laneId: number;
}

const LaneIcon = ({ className, laneId }: LaneIconProps) => {
  const laneIcons = [
    <svg
      className={clsx('LaneIcon', 'top', className)}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
    >
      <path d="M4 4h22.137l-4.406 4.786H8.786v12.945L4 26.137V4z" />
      <path
        fillOpacity=".4"
        d="M27.333 27.333H6.393l5.041-4.188h11.712V10.918l4.188-4.526v20.94zM12.974 12.974h5.983v5.983h-5.983v-5.983z"
      />
    </svg>,

    <svg
      className={clsx('LaneIcon', 'jg', className)}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
    >
      <path d="m16.21 29.333-7.875-7.955A18.22 18.22 0 0 0 4 10.09c6.93 2.606 8.04 7.818 8.04 7.818 1.245-6.091-3.39-15.242-3.39-15.242 13.305 16.652 7.56 26.667 7.56 26.667zM16.57 13a37.966 37.966 0 0 1 6.765-10.333 49.874 49.874 0 0 0-4.365 15.5s-1.02-3.591-2.4-5.167zM28 9.879c-9.315 5.576-8.325 15.515-8.325 15.515l4.185-4.258C23.71 13.03 28 9.878 28 9.878z" />
    </svg>,

    <svg
      className={clsx('LaneIcon', 'mid', className)}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
    >
      <path d="M5.333 26.667v-4.364l16.97-16.97h4.364v4.364l-16.97 16.97H5.333z" />
      <path
        fillOpacity=".4"
        d="m19.394 5.333-3.879 3.879H9.212v6.303l-3.879 3.879V5.333h14.061zm-6.788 21.334 3.879-3.879h6.303v-6.303l3.879-3.879v14.061H12.606z"
      />
    </svg>,

    <svg
      className={clsx('LaneIcon', 'ad', className)}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
    >
      <path d="M27.333 27.333H5.196l4.406-4.786h12.945V9.602l4.786-4.406v22.137z" />
      <path
        fillOpacity=".4"
        d="M4 4h20.94l-5.041 4.188H8.187v11.628l-4.188 4.526V4zm14.359 14.359h-5.983v-5.983h5.983v5.983z"
      />
    </svg>,

    <svg
      className={clsx('LaneIcon', 'sup', className)}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
    >
      <path d="M19.03 4h-6.061l-1.061 1.417 4.091 5.037 4.091-5.037L19.029 4zm-7.878 4.88H2.667c1.167 1.144 2.514 2.221 3.939 2.991.572.185 1.068.313 1.667.315h2.273l-2.424 2.991 3.939 1.889 1.515-5.667-2.424-2.519zm9.696 0h8.485c-1.168 1.143-2.515 2.222-3.939 2.991-.572.185-1.068.313-1.667.315h-2.273l2.424 2.991-3.939 1.889-1.515-5.667 2.424-2.519zm-1.666 15.268-2.424-12.593a.863.863 0 0 1-.758.63.87.87 0 0 1-.758-.63l-2.424 12.593L16 26.667l3.182-2.519z" />
    </svg>,
  ];

  return laneIcons[laneId];
};

export default LaneIcon;
