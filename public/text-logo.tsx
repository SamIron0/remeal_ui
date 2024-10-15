export default function TextLogo({ className }: { className?: string }) {
  return (
    <svg
      width="400"
      height="101"
      viewBox="0 0 400 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.00468445 5.15625H33.198C40.3309 5.15625 46.4109 6.23047 51.4383 8.37891C56.4656 10.5273 60.3113 13.707 62.9754 17.918C65.6824 22.0859 67.0359 27.2422 67.0359 33.3867C67.0359 38.0703 66.1766 42.1953 64.4578 45.7617C62.7391 49.3281 60.3113 52.3359 57.1746 54.7852C54.0379 57.1914 50.2996 59.0605 45.9598 60.3926L41.0613 62.7773H11.2195L11.0906 49.9512H33.4559C37.323 49.9512 40.5457 49.2637 43.1238 47.8887C45.702 46.5137 47.6355 44.6445 48.9246 42.2812C50.2566 39.875 50.9227 37.168 50.9227 34.1602C50.9227 30.8945 50.2781 28.0586 48.9891 25.6523C47.743 23.2031 45.8094 21.334 43.1883 20.0449C40.5672 18.7129 37.2371 18.0469 33.198 18.0469H16.1824V99H0.00468445V5.15625ZM53.5652 99L31.5223 56.8477L48.4734 56.7832L70.8387 98.1621V99H53.5652ZM107.066 100.289C101.91 100.289 97.2481 99.4512 93.0802 97.7754C88.9552 96.0566 85.4317 93.6719 82.5098 90.6211C79.6309 87.5703 77.418 83.9824 75.8712 79.8574C74.3243 75.7324 73.5509 71.2852 73.5509 66.5156V63.9375C73.5509 58.4805 74.3458 53.5391 75.9356 49.1133C77.5255 44.6875 79.7384 40.9062 82.5743 37.7695C85.4102 34.5898 88.7618 32.1621 92.629 30.4863C96.4962 28.8105 100.686 27.9727 105.197 27.9727C110.182 27.9727 114.543 28.8105 118.281 30.4863C122.02 32.1621 125.113 34.5254 127.563 37.5762C130.055 40.584 131.902 44.1719 133.106 48.3398C134.352 52.5078 134.975 57.1055 134.975 62.1328V68.7715H81.0919V57.6211H119.635V56.3965C119.549 53.6035 118.99 50.9824 117.959 48.5332C116.971 46.084 115.445 44.1074 113.383 42.6035C111.32 41.0996 108.57 40.3477 105.133 40.3477C102.555 40.3477 100.256 40.9062 98.2364 42.0234C96.2598 43.0977 94.6055 44.666 93.2735 46.7285C91.9415 48.791 90.9102 51.2832 90.1798 54.2051C89.4923 57.084 89.1485 60.3281 89.1485 63.9375V66.5156C89.1485 69.5664 89.5567 72.4023 90.3731 75.0234C91.2325 77.6016 92.4786 79.8574 94.1114 81.791C95.7442 83.7246 97.7208 85.25 100.041 86.3672C102.361 87.4414 105.004 87.9785 107.969 87.9785C111.707 87.9785 115.037 87.2266 117.959 85.7227C120.881 84.2188 123.416 82.0918 125.565 79.3418L133.75 87.2695C132.246 89.4609 130.291 91.5664 127.885 93.5859C125.479 95.5625 122.535 97.1738 119.055 98.4199C115.617 99.666 111.621 100.289 107.066 100.289Z"
        fill="black"
      />
      <path
        d="M157.345 43.4414V99H141.812V29.2617H156.443L157.345 43.4414ZM154.831 61.5527L149.546 61.4883C149.546 56.6758 150.148 52.2285 151.351 48.1465C152.554 44.0645 154.316 40.5195 156.636 37.5117C158.956 34.4609 161.835 32.1191 165.273 30.4863C168.753 28.8105 172.771 27.9727 177.326 27.9727C180.505 27.9727 183.406 28.4453 186.027 29.3906C188.691 30.293 190.99 31.7324 192.923 33.709C194.9 35.6855 196.404 38.2207 197.435 41.3145C198.509 44.4082 199.046 48.1465 199.046 52.5293V99H183.513V53.8828C183.513 50.4883 182.997 47.8242 181.966 45.8906C180.978 43.957 179.538 42.582 177.648 41.7656C175.8 40.9062 173.587 40.4766 171.009 40.4766C168.087 40.4766 165.595 41.0352 163.533 42.1523C161.513 43.2695 159.859 44.7949 158.57 46.7285C157.281 48.6621 156.335 50.8965 155.734 53.4316C155.132 55.9668 154.831 58.6738 154.831 61.5527ZM198.079 57.4277L190.796 59.0391C190.796 54.8281 191.376 50.8535 192.536 47.1152C193.74 43.334 195.48 40.0254 197.757 37.1895C200.077 34.3105 202.935 32.0547 206.329 30.4219C209.724 28.7891 213.613 27.9727 217.995 27.9727C221.562 27.9727 224.742 28.4668 227.535 29.4551C230.37 30.4004 232.777 31.9043 234.753 33.9668C236.73 36.0293 238.234 38.7148 239.265 42.0234C240.296 45.2891 240.812 49.2422 240.812 53.8828V99H225.214V53.8184C225.214 50.2949 224.699 47.5664 223.667 45.6328C222.679 43.6992 221.261 42.3672 219.413 41.6367C217.566 40.8633 215.353 40.4766 212.775 40.4766C210.369 40.4766 208.242 40.9277 206.394 41.8301C204.589 42.6895 203.064 43.9141 201.818 45.5039C200.572 47.0508 199.626 48.834 198.982 50.8535C198.38 52.873 198.079 55.0645 198.079 57.4277ZM282.26 100.289C277.104 100.289 272.442 99.4512 268.274 97.7754C264.149 96.0566 260.626 93.6719 257.704 90.6211C254.825 87.5703 252.612 83.9824 251.065 79.8574C249.518 75.7324 248.745 71.2852 248.745 66.5156V63.9375C248.745 58.4805 249.54 53.5391 251.13 49.1133C252.719 44.6875 254.932 40.9062 257.768 37.7695C260.604 34.5898 263.956 32.1621 267.823 30.4863C271.69 28.8105 275.88 27.9727 280.391 27.9727C285.376 27.9727 289.737 28.8105 293.475 30.4863C297.214 32.1621 300.307 34.5254 302.756 37.5762C305.249 40.584 307.096 44.1719 308.299 48.3398C309.546 52.5078 310.169 57.1055 310.169 62.1328V68.7715H256.286V57.6211H294.829V56.3965C294.743 53.6035 294.184 50.9824 293.153 48.5332C292.165 46.084 290.639 44.1074 288.577 42.6035C286.514 41.0996 283.764 40.3477 280.327 40.3477C277.749 40.3477 275.45 40.9062 273.43 42.0234C271.454 43.0977 269.799 44.666 268.467 46.7285C267.135 48.791 266.104 51.2832 265.374 54.2051C264.686 57.084 264.342 60.3281 264.342 63.9375V66.5156C264.342 69.5664 264.751 72.4023 265.567 75.0234C266.426 77.6016 267.672 79.8574 269.305 81.791C270.938 83.7246 272.915 85.25 275.235 86.3672C277.555 87.4414 280.198 87.9785 283.163 87.9785C286.901 87.9785 290.231 87.2266 293.153 85.7227C296.075 84.2188 298.61 82.0918 300.758 79.3418L308.944 87.2695C307.44 89.4609 305.485 91.5664 303.079 93.5859C300.672 95.5625 297.729 97.1738 294.249 98.4199C290.811 99.666 286.815 100.289 282.26 100.289ZM356.322 85.0137V51.7559C356.322 49.2637 355.871 47.1152 354.969 45.3105C354.066 43.5059 352.691 42.1094 350.844 41.1211C349.039 40.1328 346.762 39.6387 344.012 39.6387C341.477 39.6387 339.285 40.0684 337.437 40.9277C335.59 41.7871 334.15 42.9473 333.119 44.4082C332.088 45.8691 331.572 47.5234 331.572 49.3711H316.103C316.103 46.6211 316.769 43.957 318.102 41.3789C319.434 38.8008 321.367 36.502 323.902 34.4824C326.437 32.4629 329.467 30.873 332.99 29.7129C336.514 28.5527 340.467 27.9727 344.85 27.9727C350.092 27.9727 354.732 28.8535 358.771 30.6152C362.853 32.377 366.055 35.041 368.375 38.6074C370.738 42.1309 371.92 46.5566 371.92 51.8848V82.8867C371.92 86.0664 372.135 88.9238 372.564 91.459C373.037 93.9512 373.703 96.1211 374.562 97.9688V99H358.643C357.912 97.3242 357.332 95.1973 356.902 92.6191C356.516 89.998 356.322 87.4629 356.322 85.0137ZM358.578 56.5898L358.707 66.1934H347.557C344.678 66.1934 342.143 66.4727 339.951 67.0312C337.76 67.5469 335.934 68.3203 334.473 69.3516C333.012 70.3828 331.916 71.6289 331.185 73.0898C330.455 74.5508 330.09 76.2051 330.09 78.0527C330.09 79.9004 330.519 81.5977 331.379 83.1445C332.238 84.6484 333.484 85.8301 335.117 86.6895C336.793 87.5488 338.812 87.9785 341.176 87.9785C344.355 87.9785 347.127 87.334 349.49 86.0449C351.896 84.7129 353.787 83.1016 355.162 81.2109C356.537 79.2773 357.268 77.4512 357.353 75.7324L362.381 82.6289C361.865 84.3906 360.984 86.2812 359.738 88.3008C358.492 90.3203 356.859 92.2539 354.84 94.1016C352.863 95.9062 350.478 97.3887 347.685 98.5488C344.935 99.709 341.756 100.289 338.146 100.289C333.592 100.289 329.531 99.3867 325.965 97.582C322.398 95.7344 319.605 93.2637 317.586 90.1699C315.566 87.0332 314.557 83.4883 314.557 79.5352C314.557 75.8398 315.244 72.5742 316.619 69.7383C318.037 66.8594 320.1 64.4531 322.807 62.5195C325.557 60.5859 328.908 59.125 332.861 58.1367C336.814 57.1055 341.326 56.5898 346.396 56.5898H358.578ZM399.511 0V99H383.913V0H399.511Z"
        fill="url(#paint0_linear_52_18)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_52_18"
          x1="-78"
          y1="54"
          x2="477"
          y2="54"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.243" />
          <stop offset="0.775" stopColor="#424242" />
        </linearGradient>
      </defs>
    </svg>
  );
}
