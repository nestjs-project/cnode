import { Injectable, Logger } from '@nestjs/common';
import { TopicDbService } from '../../shared';

@Injectable()
export class TopicService {
    private readonly logger = new Logger(TopicService.name, true);
    constructor(
        private readonly topicDbService: TopicDbService,
    ) { }

}