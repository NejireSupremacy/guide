import djsAvatar from './assets/discord-avatar-djs.png';
import {
    NejireAvatar,
    FreeAvatar,
	SocramAvatar
} from './assets/avatars';

export default {
    avatars: {
        djs: djsAvatar
    },
	profiles: {
	    user: {
			author: 'Usuario',
			avatar: 'djs',
            roleColor: '#5865F2'
		},
        bot: {
            author: 'Bot de pruebas',
            avatar: 'green',
            bot: true,
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
        },
		socram: {
			author: 'Socram09',
			avatar: SocramAvatar,
			roleColor: '#ff96ed',
		}
	}

}
