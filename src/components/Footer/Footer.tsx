import logoIdesam from '../../assets/img/selo-idesam-20-anos-branco.png';
import styles from './Footer.module.scss';

export default function Footer() {
    return (
        <footer className={styles.container}>
            <div>
                <img className={styles.img} src={logoIdesam} alt="logo Idesam" />

                <ul className="flex gap-4 list-none p-2">
                    <li>
                        <a href="https://www.facebook.com/idesam" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-blue-600 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.406.593 24 1.325 24H12.82V14.709h-3.293V11.08h3.293V8.413c0-3.258 1.987-5.032 4.89-5.032 1.39 0 2.586.104 2.933.15v3.4h-2.014c-1.579 0-1.885.75-1.885 1.85v2.399h3.771l-.492 3.63h-3.279V24h6.432c.73 0 1.324-.594 1.324-1.324V1.325C24 .593 23.406 0 22.675 0z" /></svg>
                        </a>
                    </li>

                    <li>
                        <a href="https://www.youtube.com/user/idesanico" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-red-500 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M23.498 6.186a2.993 2.993 0 0 0-2.11-2.11C19.495 3.5 12 3.5 12 3.5s-7.495 0-9.388.576a2.993 2.993 0 0 0-2.11 2.11C0 8.079 0 12 0 12s0 3.921.502 5.814a2.993 2.993 0 0 0 2.11 2.11C4.505 20.5 12 20.5 12 20.5s7.495 0 9.388-.576a2.993 2.993 0 0 0 2.11-2.11C24 15.921 24 12 24 12s0-3.921-.502-5.814zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" /></svg>
                        </a>
                    </li>

                    <li>
                        <a href="https://www.instagram.com/idesam/" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-pink-400 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.3 2.3.5.6.3 1 .7 1.3 1.3.2.4.4 1.1.5 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.9-.5 2.3-.3.6-.7 1-1.3 1.3-.4.2-1.1.4-2.3.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.3-2.3-.5-.6-.3-1-.7-1.3-1.3-.2-.4-.4-1.1-.5-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.9.5-2.3.3-.6.7-1 1.3-1.3.4-.2 1.1-.4 2.3-.5C8.4 2.2 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3 0 7.1.1 5.9.2 4.9.4 4 .8c-.9.4-1.6 1-2.3 1.7C.9 3.2.4 4 .2 4.9.1 6.1 0 6.5 0 10s.1 3.9.2 5.1c.1.9.4 1.7.8 2.6.4.9 1 1.6 1.7 2.3.7.7 1.4 1.2 2.3 1.6.9.4 1.7.7 2.6.8C8.3 24 8.7 24 12 24s3.9-.1 5.1-.2c.9-.1 1.7-.4 2.6-.8.9-.4 1.6-1 2.3-1.6.7-.7 1.2-1.4 1.6-2.3.4-.9.7-1.7.8-2.6.1-1.2.2-1.6.2-5.1s-.1-3.9-.2-5.1c-.1-.9-.4-1.7-.8-2.6-.4-.9-1-1.6-1.6-2.3C21.1.9 20.4.4 19.5.2 18.3.1 17.9 0 14.4 0H12z" /><path d="M12 5.8c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2S15.4 5.8 12 5.8zm0 10.2c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zM18.4 4.6c0 .8-.6 1.4-1.4 1.4s-1.4-.6-1.4-1.4.6-1.4 1.4-1.4 1.4.6 1.4 1.4z" /></svg>
                        </a>
                    </li>

                    <li>
                        <a href="https://www.flickr.com/photos/idesam/" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-blue-400 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><circle cx="6.5" cy="12" r="4.5" /><circle cx="17.5" cy="12" r="4.5" /></svg>
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    )
}