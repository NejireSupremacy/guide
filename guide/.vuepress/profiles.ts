import djsAvatar from './assets/discord-avatar-djs.png';
import guideLogo from './assets/guide-logo.png';
import { 
    NejireAvatar,
    FreeAvatar
} from './assets/avatars';

export default {
    avatars: {
        djs: djsAvatar,
        guide: guideLogo
    },
	profiles: {
	    user: {
			author: 'Usuario',
			avatar: 'djs',
            roleColor: '#5865F2'
		}, 
		bot: {
			author: 'Bot de pruebas',
			avatar: 'guide',
			bot: true
		},
        nejire: {
            author: 'ThisIsAName',
            avatar: NejireAvatar,
            roleColor: '#C586D5'
        },
        free: {
            author: 'Free 公園',
            avatar: FreeAvatar,
            roleColor: '#ff0b3f'
        }
	}
}