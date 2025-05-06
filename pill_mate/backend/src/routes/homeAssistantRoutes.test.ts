import request from 'supertest';

import app from '../app';

import { User } from '../models/User';
import { UserRole } from '../models/UserRole';
import { HomeAssistantService } from '../services/HomeAssistantService';

jest.mock('../models/User', () => {
    return {
        User: {
            findOne: jest.fn(),
        },
    };
});

jest.mock('../services/HomeAssistantService', () => {
    return {
        HomeAssistantService: {
            getMobileAppDevices: jest.fn(),
        },
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('GET /homeassistant/mobile-app-devices', () => {
    it('should return 400 if the x-remote-user-id header is missing', async () => {
        const response = await request(app)
            .get('/homeassistant/mobile-app-devices')
            .set('x-remote-user-name', 'johndoe')
            .set('x-remote-user-display-name', 'John Doe');
        expect(response.body).toStrictEqual({
            message: 'Missing required header: x-remote-user-id.',
        });
        expect(response.status).toBe(400);
    });

    it('should return 400 if the x-remote-user-id is not a valid user id', async () => {
        const response = await request(app)
            .get('/homeassistant/mobile-app-devices')
            .set('x-remote-user-id', 'bad home assistant id')
            .set('x-remote-user-name', 'johndoe')
            .set('x-remote-user-display-name', 'John Doe');
        expect(response.body).toStrictEqual({
            message: 'Invalid home assistant user id in x-remote-user-id.',
        });
        expect(response.status).toBe(400);
    });

    it('should return 400 if the x-remote-user-name header is missing', async () => {
        const response = await request(app)
            .get('/homeassistant/mobile-app-devices')
            .set('x-remote-user-id', 'c355d2aaeee44e4e84ff8394fa4794a9')
            .set('x-remote-user-display-name', 'John Doe');
        expect(response.body).toStrictEqual({
            message: 'Missing required header: x-remote-user-name.',
        });
        expect(response.status).toBe(400);
    });

    it('should return 400 if the x-remote-user-display-name header is missing', async () => {
        const response = await request(app)
            .get('/homeassistant/mobile-app-devices')
            .set('x-remote-user-id', 'c355d2aaeee44e4e84ff8394fa4794a9')
            .set('x-remote-user-name', 'johndoe');
        expect(response.body).toStrictEqual({
            message: 'Missing required header: x-remote-user-display-name.',
        });
        expect(response.status).toBe(400);
    });

    it('should return 401 if user is not in the database', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .get('/homeassistant/mobile-app-devices')
            .set('x-remote-user-id', 'c355d2aaeee44e4e84ff8394fa4794a9')
            .set('x-remote-user-name', 'johndoe')
            .set('x-remote-user-display-name', 'John Doe');
        expect(response.body).toStrictEqual({ message: 'User not registered.' });
        expect(response.status).toBe(401);
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({
            where: { homeAssistantUserId: 'c355d2aaeee44e4e84ff8394fa4794a9' },
        });
    });

    it('should return the list of the names of the available devices', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            id: 1,
            homeAssistantUserId: 'c355d2aaeee44e4e84ff8394fa4794a9',
            role: UserRole.HELPED,
            mobileAppDevice: 'Redmi Note 8T',
        });

        (HomeAssistantService.getMobileAppDevices as jest.Mock).mockResolvedValue([
            { name: 'Redmi Note 8T' },
            { name: 'Redmi Note 9' },
        ]);

        const response = await request(app)
            .get('/homeassistant/mobile-app-devices')
            .set('x-remote-user-id', 'c355d2aaeee44e4e84ff8394fa4794a9')
            .set('x-remote-user-name', 'johndoe')
            .set('x-remote-user-display-name', 'John Doe');
        expect(response.body).toStrictEqual(['Redmi Note 8T', 'Redmi Note 9']);
        expect(response.status).toBe(200);
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({
            where: { homeAssistantUserId: 'c355d2aaeee44e4e84ff8394fa4794a9' },
        });
    });
});
