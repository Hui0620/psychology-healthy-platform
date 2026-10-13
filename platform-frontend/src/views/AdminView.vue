<template>
  <div class="main-content">
    <el-container style="height: 100vh">
      <el-aside width="220px">
        <el-menu
          :default-active="menuActive"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect"
        >
          <el-sub-menu index="1">
            <template #title>
              <span>模型管理</span>
            </template>
            <el-menu-item index="view-local">查看本地模型</el-menu-item>
            <el-menu-item index="view-collab">查看协同模型</el-menu-item>
            <el-menu-item index="add-local">新增本地模型</el-menu-item>
            <el-menu-item index="add-collab">新增协同模型</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <span>用户管理</span>
            </template>
            <el-menu-item index="register-user">注册用户</el-menu-item>
            <el-menu-item index="manage-user">用户信息管理</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <div v-if="menuActive==='view-local'">
          <div class="table-title">本地模型列表</div>
          <el-table :data="localModels" style="width: 100%" @expand-change="handleExpand" ref="localTable">
            <el-table-column type="expand">
              <template #default="props">
                <div class="model-info-container">
                  <el-descriptions title="模型基本信息" :column="2" border>
                    <el-descriptions-item label="模型功能" :span="2">{{ props.row.function }}</el-descriptions-item>
                    <el-descriptions-item label="技术介绍" :span="2">{{ props.row.tech }}</el-descriptions-item>
                  </el-descriptions>
                </div>
                <div class="local-model-info">
                  <h3>本地模型信息</h3>
                  <el-table :data="props.row.localFiles || props.row.rounds">
                    <el-table-column prop="round" label="轮次" width="60"/>
                    <el-table-column prop="fileType" label="文件类型" width="80"/>
                    <el-table-column prop="fileSize" label="文件大小" width="100"/>
                    <el-table-column prop="hash" label="哈希值" width="120"/>
                    <el-table-column prop="createTime" label="创建时间" width="140"/>
                    <el-table-column label="操作" width="120">
                      <template #default="scope">
                        <el-button type="primary" text size="small" @click="verifyFile(scope.row)">验证</el-button>
                        <el-button type="success" text size="small" @click="downloadFile(scope.row)">下载</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="模型ID" width="120" />
            <el-table-column prop="time" label="时间" width="200" />
            <el-table-column prop="round" label="轮次" width="100" />
            <el-table-column label="操作" width="220">
              <template #default="scope">
                <div class="btn-group align-center">
                  <el-button type="primary" text @click="toggleExpandLocal(scope.row)">查看</el-button>
                  <el-button
                    v-if="!scope.row.training"
                    type="success"
                    text
                    @click="handleTrainLocal(scope.row)"
                  >训练</el-button>
                  <el-button
                    v-else
                    type="success"
                    text
                    disabled
                  >训练</el-button>
                  <el-button
                    v-if="scope.row.training"
                    type="danger"
                    text
                    @click="handleStopTrainLocal(scope.row)"
                  >停止训练</el-button>
                  <el-button
                    v-else
                    type="danger"
                    text
                    disabled
                  >停止训练</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else-if="menuActive==='view-collab'">
          <div class="table-title">协同模型列表</div>
          <el-table :data="collabModels" style="width: 100%" @expand-change="handleExpand" ref="collabTable">
            <el-table-column type="expand">
              <template #default="props">
                <div class="model-info-container">
                  <el-descriptions title="模型基本信息" :column="2" border>
                    <el-descriptions-item label="参与机构" :span="2">{{ props.row.orgs.join('、') }}</el-descriptions-item>
                    <el-descriptions-item label="模型功能" :span="2">{{ props.row.function }}</el-descriptions-item>
                    <el-descriptions-item label="技术介绍" :span="2">{{ props.row.tech }}</el-descriptions-item>
                  </el-descriptions>
                </div>
                <div class="model-details-container">
                  <div class="global-model-info">
                    <h3>全局模型信息</h3>
                    <el-table :data="props.row.globalFiles || props.row.rounds">
                      <el-table-column prop="round" label="轮次" width="60"/>
                      <el-table-column prop="fileType" label="文件类型" width="80"/>
                      <el-table-column prop="fileSize" label="文件大小" width="100"/>
                      <el-table-column prop="hash" label="哈希值" width="120"/>
                      <el-table-column prop="createTime" label="创建时间" width="140"/>
                      <el-table-column label="操作" width="120">
                        <template #default="scope">
                          <el-button type="primary" text size="small" @click="verifyFile(scope.row)">验证</el-button>
                          <el-button type="success" text size="small" @click="downloadFile(scope.row)">下载</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="personalized-model-info">
                    <h3>个性化模型信息</h3>
                    <el-table :data="props.row.personalizedFiles || props.row.rounds">
                      <el-table-column prop="round" label="轮次" width="60"/>
                      <el-table-column prop="fileType" label="文件类型" width="80"/>
                      <el-table-column prop="fileSize" label="文件大小" width="100"/>
                      <el-table-column prop="hash" label="哈希值" width="120"/>
                      <el-table-column prop="createTime" label="创建时间" width="140"/>
                      <el-table-column label="操作" width="120">
                        <template #default="scope">
                          <el-button type="primary" text size="small" @click="verifyFile(scope.row)">验证</el-button>
                          <el-button type="success" text size="small" @click="downloadFile(scope.row)">下载</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="模型ID" width="120" />
            <el-table-column prop="time" label="时间" width="200" />
            <el-table-column prop="round" label="轮次" width="100" />
            <el-table-column prop="agency" label="发起机构ID" width="120" />
            <el-table-column label="操作" width="320">
              <template #default="scope">
                <div class="btn-group align-center">
                  <el-button type="primary" text @click="toggleExpand(scope.row)">查看</el-button>
                  <el-button
                    v-if="!scope.row.personalized"
                    type="success"
                    text
                    @click="handleJoinPersonalized(scope.row)"
                  >加入个性化</el-button>
                  <el-button
                    v-else
                    type="success"
                    text
                    @click="handleStopPersonalized(scope.row)"
                  >停止个性化</el-button>
                  <el-button
                    v-if="!scope.row.global"
                    type="warning"
                    text
                    @click="handleJoinGlobal(scope.row)"
                  >加入全局</el-button>
                  <el-button
                    v-else
                    type="warning"
                    text
                    @click="handleStopGlobal(scope.row)"
                  >停止全局</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else-if="menuActive==='add-local'">
          <div class="table-title">新增本地模型</div>
          <el-form :model="addLocalForm" :rules="addLocalRules" ref="addLocalFormRef" label-width="110px" style="max-width: 500px; margin: 30px 0 0 20px;">
            <el-form-item label="模型功能" prop="function">
              <el-input v-model="addLocalForm.function" placeholder="请输入模型功能" />
            </el-form-item>
            <el-form-item label="技术介绍" prop="tech">
              <el-input type="textarea" v-model="addLocalForm.tech" :rows="4" placeholder="请输入模型技术介绍" />
            </el-form-item>
            <el-form-item label="激励积分" prop="reward">
              <el-input-number v-model="addLocalForm.reward" :min="0" :max="10000" placeholder="请输入激励积分" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="模型参数文件" prop="file">
              <el-upload
                class="upload-demo"
                action="#"
                :auto-upload="false"
                :file-list="addLocalForm.fileList"
                :on-change="handleFileChange"
                :limit="1"
                :before-remove="beforeRemoveFile"
                :on-remove="handleRemoveFile"
                accept=".pt,.pth,.bin,.h5,.ckpt"
              >
                <el-button type="primary">选择文件</el-button>
                <template #tip>
                  <div class="el-upload__tip">支持PT/PTH/BIN/H5/CKPT格式，单次仅限1个文件</div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="uploadToBlockchain">上传至区块链</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else-if="menuActive==='add-collab'">
          <div class="table-title">新增协同模型</div>
          <el-form :model="addCollabForm" :rules="addCollabRules" ref="addCollabFormRef" label-width="110px" style="max-width: 500px; margin: 30px 0 0 20px;">
            <el-form-item label="模型功能" prop="function">
              <el-input v-model="addCollabForm.function" placeholder="请输入模型功能" />
            </el-form-item>
            <el-form-item label="技术介绍" prop="tech">
              <el-input type="textarea" v-model="addCollabForm.tech" :rows="4" placeholder="请输入模型技术介绍" />
            </el-form-item>
            <el-form-item label="激励积分" prop="reward">
              <el-input-number v-model="addCollabForm.reward" :min="0" :max="10000" placeholder="请输入激励积分" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="邀请参与机构" prop="orgs">
              <el-select v-model="addCollabForm.orgs" multiple filterable placeholder="请选择参与机构" style="width: 100%;">
                <el-option v-for="item in allOrgs" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="模型参数文件" prop="file">
              <el-upload
                class="upload-demo"
                action="#"
                :auto-upload="false"
                :file-list="addCollabForm.fileList"
                :on-change="handleCollabFileChange"
                :limit="1"
                :before-remove="beforeRemoveCollabFile"
                :on-remove="handleRemoveCollabFile"
                accept=".pt,.pth,.bin,.h5,.ckpt"
              >
                <el-button type="primary">选择文件</el-button>
                <template #tip>
                  <div class="el-upload__tip">支持PT/PTH/BIN/H5/CKPT格式，单次仅限1个文件</div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="uploadCollabToBlockchain">上传至区块链</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else-if="menuActive==='register-user'">
          <div class="table-title">注册新用户</div>
          <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="90px" style="max-width: 400px; margin: 30px 0 0 20px;">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-select v-model="registerForm.role" placeholder="请选择角色">
                <el-option label="管理员" value="admin" />
                <el-option label="医生" value="doctor" />
                <el-option label="心理老师" value="counselor" />
                <el-option label="学生" value="user" />
              </el-select>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="registerForm.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitRegister">注册</el-button>
              <el-button @click="resetRegister">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else-if="menuActive==='manage-user'">
          <div class="table-title">用户信息管理</div>
          <el-table :data="userList" style="width: 100%; max-width: 900px; margin-left: 20px;">
            <el-table-column prop="username" label="用户名" width="120" />
            <el-table-column prop="role" label="角色" width="100" />
            <el-table-column prop="phone" label="手机号" width="140" />
            <el-table-column prop="email" label="邮箱" width="180" />
            <el-table-column prop="registerTime" label="注册时间" width="160" />
            <el-table-column label="操作" width="140">
              <template #default="scope">
                <el-button type="primary" text @click="editUser(scope.row)">编辑</el-button>
                <el-button type="danger" text @click="deleteUser(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog v-model="editDialogVisible" title="编辑用户" width="400px">
            <el-form :model="editForm" label-width="90px">
              <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled />
              </el-form-item>
              <el-form-item label="角色">
                <el-select v-model="editForm.role">
                  <el-option label="管理员" value="admin" />
                  <el-option label="医生" value="doctor" />
                  <el-option label="心理老师" value="counselor" />
                  <el-option label="学生" value="user" />
                </el-select>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="editForm.phone" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="editForm.email" />
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="editDialogVisible=false">取消</el-button>
              <el-button type="primary" @click="saveEditUser">保存</el-button>
            </template>
          </el-dialog>
        </div>
        <div v-else>请选择左侧菜单功能</div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'AdminView',
  data() {
    return {
      menuActive: '',
      localModels: [
        { 
          id: '1000', 
          time: '2024-07-01 11:53:18', 
          round: 5, 
          training: false,
          function: '用于本地心理健康风险评估和个性化干预建议生成。',
          tech: '基于深度学习算法，结合本地数据特征进行模型训练，支持实时预测和干预建议。',
          localFiles: [
            { round: 1, fileType: 'PT', fileSize: '128MB', hash: 'x1y2z3a4b5c6', createTime: '2024-07-01 11:53:18' },
            { round: 2, fileType: 'PT', fileSize: '135MB', hash: 'y2z3a4b5c6x1', createTime: '2024-07-01 12:15:30' },
            { round: 3, fileType: 'PT', fileSize: '142MB', hash: 'z3a4b5c6x1y2', createTime: '2024-07-01 13:20:45' },
            { round: 4, fileType: 'PT', fileSize: '148MB', hash: 'a4b5c6x1y2z3', createTime: '2024-07-01 14:30:20' },
            { round: 5, fileType: 'PT', fileSize: '155MB', hash: 'b5c6x1y2z3a4', createTime: '2024-07-01 15:45:10' }
          ]
        },
        { 
          id: '1001', 
          time: '2024-06-02 10:32:50', 
          round: 500, 
          training: true,
          function: '实现高精度心理健康预测模型，支持多维度风险评估。',
          tech: '采用Transformer架构，结合注意力机制，实现高精度的心理健康状态预测。',
          localFiles: [
            { round: 1, fileType: 'PT', fileSize: '145MB', hash: 'c1d2e3f4g5h6', createTime: '2024-06-02 10:32:50' },
            { round: 2, fileType: 'PT', fileSize: '152MB', hash: 'd2e3f4g5h6c1', createTime: '2024-06-02 11:45:20' },
            { round: 3, fileType: 'PT', fileSize: '158MB', hash: 'e3f4g5h6c1d2', createTime: '2024-06-02 13:10:35' },
            { round: 4, fileType: 'PT', fileSize: '165MB', hash: 'f4g5h6c1d2e3', createTime: '2024-06-02 14:25:40' },
            { round: 5, fileType: 'PT', fileSize: '172MB', hash: 'g5h6c1d2e3f4', createTime: '2024-06-02 15:50:15' }
          ]
        },
        { 
          id: '1002', 
          time: '2024-06-14 05:16:18', 
          round: 100, 
          training: false,
          function: '针对特定场景的心理健康干预模型，提供精准的干预策略。',
          tech: '基于强化学习算法，结合专家知识库，实现智能化的干预策略推荐。',
          localFiles: [
            { round: 1, fileType: 'PT', fileSize: '118MB', hash: 'h1i2j3k4l5m6', createTime: '2024-06-14 05:16:18' },
            { round: 2, fileType: 'PT', fileSize: '125MB', hash: 'i2j3k4l5m6h1', createTime: '2024-06-14 06:30:25' },
            { round: 3, fileType: 'PT', fileSize: '132MB', hash: 'j3k4l5m6h1i2', createTime: '2024-06-14 07:45:30' },
            { round: 4, fileType: 'PT', fileSize: '138MB', hash: 'k4l5m6h1i2j3', createTime: '2024-06-14 09:15:45' },
            { round: 5, fileType: 'PT', fileSize: '145MB', hash: 'l5m6h1i2j3k4', createTime: '2024-06-14 10:30:20' }
          ]
        },
      ],
      collabModels: [
        {
          id: '2000',
          time: '2024-07-01 12:00:00',
          round: 10,
          agency: '003',
          personalized: false,
          global: false,
          type: '全局模型',
          orgs: ['北京师范大学', '深圳职业技术学院', '清华大学', '北京大学附属医院', '北京安定医院'],
          function: '用于大学生心理健康风险预测、个性化干预建议和心理危机预警。',
          tech: '采用联邦学习框架，结合深度神经网络与NLP文本分析，实现多机构数据安全协同建模。支持DSM-5多轴诊断、风险评估与干预建议自动生成。',
          rounds: [
            { round: 1, gradient: 269, score: 8, reward: 9 },
            { round: 2, gradient: 312, score: 8, reward: 9 },
            { round: 3, gradient: 282, score: 9, reward: 10 },
            { round: 4, gradient: 47, score: 9, reward: 10 },
            { round: 5, gradient: 15, score: 7, reward: 8 },
            { round: 6, gradient: 199, score: 7, reward: 8 },
            { round: 7, gradient: 226, score: 8, reward: 9 },
            { round: 8, gradient: 214, score: 7, reward: 9 },
            { round: 9, gradient: 222, score: 8, reward: 9 },
            { round: 10, gradient: 82, score: 7, reward: 8 }
          ],
          globalFiles: [
            { round: 1, fileType: 'PT', fileSize: '256MB', hash: 'a1b2c3d4e5f6', createTime: '2024-07-01 10:30:00' },
            { round: 2, fileType: 'PT', fileSize: '268MB', hash: 'b2c3d4e5f6a1', createTime: '2024-07-01 11:45:00' },
            { round: 3, fileType: 'PT', fileSize: '275MB', hash: 'c3d4e5f6a1b2', createTime: '2024-07-01 13:20:00' },
            { round: 4, fileType: 'PT', fileSize: '282MB', hash: 'd4e5f6a1b2c3', createTime: '2024-07-01 15:10:00' },
            { round: 5, fileType: 'PT', fileSize: '289MB', hash: 'e5f6a1b2c3d4', createTime: '2024-07-01 16:30:00' },
            { round: 6, fileType: 'PT', fileSize: '295MB', hash: 'f6a1b2c3d4e5', createTime: '2024-07-01 18:15:00' },
            { round: 7, fileType: 'PT', fileSize: '301MB', hash: 'a2b3c4d5e6f7', createTime: '2024-07-01 20:00:00' },
            { round: 8, fileType: 'PT', fileSize: '308MB', hash: 'b3c4d5e6f7a2', createTime: '2024-07-01 21:45:00' },
            { round: 9, fileType: 'PT', fileSize: '315MB', hash: 'c4d5e6f7a2b3', createTime: '2024-07-01 23:30:00' },
            { round: 10, fileType: 'PT', fileSize: '322MB', hash: 'd5e6f7a2b3c4', createTime: '2024-07-02 01:15:00' }
          ],
          personalizedFiles: [
            { round: 1, fileType: 'PT', fileSize: '185MB', hash: 'f1e2d3c4b5a6', createTime: '2024-07-01 10:35:00' },
            { round: 2, fileType: 'PT', fileSize: '192MB', hash: 'e2d3c4b5a6f1', createTime: '2024-07-01 11:50:00' },
            { round: 3, fileType: 'PT', fileSize: '198MB', hash: 'd3c4b5a6f1e2', createTime: '2024-07-01 13:25:00' },
            { round: 4, fileType: 'PT', fileSize: '205MB', hash: 'c4b5a6f1e2d3', createTime: '2024-07-01 15:15:00' },
            { round: 5, fileType: 'PT', fileSize: '212MB', hash: 'b5a6f1e2d3c4', createTime: '2024-07-01 16:35:00' },
            { round: 6, fileType: 'PT', fileSize: '218MB', hash: 'a6f1e2d3c4b5', createTime: '2024-07-01 18:20:00' },
            { round: 7, fileType: 'PT', fileSize: '225MB', hash: 'f2e3d4c5b6a7', createTime: '2024-07-01 20:05:00' },
            { round: 8, fileType: 'PT', fileSize: '232MB', hash: 'e3d4c5b6a7f2', createTime: '2024-07-01 21:50:00' },
            { round: 9, fileType: 'PT', fileSize: '238MB', hash: 'd4c5b6a7f2e3', createTime: '2024-07-01 23:35:00' },
            { round: 10, fileType: 'PT', fileSize: '245MB', hash: 'c5b6a7f2e3d4', createTime: '2024-07-02 01:20:00' }
          ]
        },
        {
          id: '2001',
          time: '2024-06-10 09:00:00',
          round: 200,
          agency: '004',
          personalized: true,
          global: true,
          type: '个性化模型',
          orgs: ['华东师范大学', '上海工艺美术职业学院', '上海交通大学', '复旦大学附属医院', '上海精神卫生中心'],
          function: '针对高校学生焦虑、抑郁等心理问题进行个性化风险评估和干预建议。',
          tech: '基于多任务学习和情感分析，结合个体画像实现精准干预。',
          rounds: [
            { round: 1, gradient: 180, score: 7, reward: 8 },
            { round: 2, gradient: 210, score: 8, reward: 9 },
            { round: 3, gradient: 150, score: 8, reward: 9 },
            { round: 4, gradient: 90, score: 9, reward: 10 },
            { round: 5, gradient: 60, score: 8, reward: 9 },
            { round: 6, gradient: 120, score: 7, reward: 8 },
            { round: 7, gradient: 130, score: 8, reward: 9 },
            { round: 8, gradient: 110, score: 8, reward: 9 },
            { round: 9, gradient: 100, score: 7, reward: 8 },
            { round: 10, gradient: 95, score: 8, reward: 9 }
          ],
          globalFiles: [
            { round: 1, fileType: 'PT', fileSize: '328MB', hash: 'g1h2i3j4k5l6', createTime: '2024-06-10 09:15:00' },
            { round: 2, fileType: 'PT', fileSize: '335MB', hash: 'h2i3j4k5l6g1', createTime: '2024-06-10 10:30:00' },
            { round: 3, fileType: 'PT', fileSize: '342MB', hash: 'i3j4k5l6g1h2', createTime: '2024-06-10 12:05:00' },
            { round: 4, fileType: 'PT', fileSize: '349MB', hash: 'j4k5l6g1h2i3', createTime: '2024-06-10 13:55:00' },
            { round: 5, fileType: 'PT', fileSize: '356MB', hash: 'k5l6g1h2i3j4', createTime: '2024-06-10 15:15:00' },
            { round: 6, fileType: 'PT', fileSize: '363MB', hash: 'l6g1h2i3j4k5', createTime: '2024-06-10 17:00:00' },
            { round: 7, fileType: 'PT', fileSize: '370MB', hash: 'g2h3i4j5k6l7', createTime: '2024-06-10 18:45:00' },
            { round: 8, fileType: 'PT', fileSize: '377MB', hash: 'h3i4j5k6l7g2', createTime: '2024-06-10 20:30:00' },
            { round: 9, fileType: 'PT', fileSize: '384MB', hash: 'i4j5k6l7g2h3', createTime: '2024-06-10 22:15:00' },
            { round: 10, fileType: 'PT', fileSize: '391MB', hash: 'j5k6l7g2h3i4', createTime: '2024-06-11 00:00:00' }
          ],
          personalizedFiles: [
            { round: 1, fileType: 'PT', fileSize: '215MB', hash: 'm1n2o3p4q5r6', createTime: '2024-06-10 09:20:00' },
            { round: 2, fileType: 'PT', fileSize: '222MB', hash: 'n2o3p4q5r6m1', createTime: '2024-06-10 10:35:00' },
            { round: 3, fileType: 'PT', fileSize: '228MB', hash: 'o3p4q5r6m1n2', createTime: '2024-06-10 12:10:00' },
            { round: 4, fileType: 'PT', fileSize: '235MB', hash: 'p4q5r6m1n2o3', createTime: '2024-06-10 14:00:00' },
            { round: 5, fileType: 'PT', fileSize: '242MB', hash: 'q5r6m1n2o3p4', createTime: '2024-06-10 15:20:00' },
            { round: 6, fileType: 'PT', fileSize: '248MB', hash: 'r6m1n2o3p4q5', createTime: '2024-06-10 17:05:00' },
            { round: 7, fileType: 'PT', fileSize: '255MB', hash: 'm2n3o4p5q6r7', createTime: '2024-06-10 18:50:00' },
            { round: 8, fileType: 'PT', fileSize: '262MB', hash: 'n3o4p5q6r7m2', createTime: '2024-06-10 20:35:00' },
            { round: 9, fileType: 'PT', fileSize: '268MB', hash: 'o4p5q6r7m2n3', createTime: '2024-06-10 22:20:00' },
            { round: 10, fileType: 'PT', fileSize: '275MB', hash: 'p5q6r7m2n3o4', createTime: '2024-06-11 00:05:00' }
          ]
        },
        {
          id: '2002',
          time: '2024-06-15 15:30:00',
          round: 50,
          agency: '005',
          personalized: false,
          global: true,
          type: '全局模型',
          orgs: ['华中师范大学', '武汉职业技术学院', '武汉大学', '华中科技大学附属医院', '武汉中心医院'],
          function: '实现多校心理健康数据的联合建模，提升模型泛化能力。',
          tech: '采用联邦平均算法，保障数据隐私安全。',
          rounds: [
            { round: 1, gradient: 300, score: 8, reward: 9 },
            { round: 2, gradient: 280, score: 8, reward: 9 },
            { round: 3, gradient: 260, score: 9, reward: 10 },
            { round: 4, gradient: 240, score: 9, reward: 10 },
            { round: 5, gradient: 220, score: 7, reward: 8 },
            { round: 6, gradient: 200, score: 7, reward: 8 },
            { round: 7, gradient: 180, score: 8, reward: 9 },
            { round: 8, gradient: 160, score: 7, reward: 9 },
            { round: 9, gradient: 140, score: 8, reward: 9 },
            { round: 10, gradient: 120, score: 7, reward: 8 }
          ],
          globalFiles: [
            { round: 1, fileType: 'PT', fileSize: '287MB', hash: 's1t2u3v4w5x6', createTime: '2024-06-15 14:20:00' },
            { round: 2, fileType: 'PT', fileSize: '294MB', hash: 't2u3v4w5x6s1', createTime: '2024-06-15 15:35:00' },
            { round: 3, fileType: 'PT', fileSize: '301MB', hash: 'u3v4w5x6s1t2', createTime: '2024-06-15 17:10:00' },
            { round: 4, fileType: 'PT', fileSize: '308MB', hash: 'v4w5x6s1t2u3', createTime: '2024-06-15 19:00:00' },
            { round: 5, fileType: 'PT', fileSize: '315MB', hash: 'w5x6s1t2u3v4', createTime: '2024-06-15 20:20:00' },
            { round: 6, fileType: 'PT', fileSize: '322MB', hash: 'x6s1t2u3v4w5', createTime: '2024-06-15 22:05:00' },
            { round: 7, fileType: 'PT', fileSize: '329MB', hash: 's2t3u4v5w6x7', createTime: '2024-06-15 23:50:00' },
            { round: 8, fileType: 'PT', fileSize: '336MB', hash: 't3u4v5w6x7s2', createTime: '2024-06-16 01:35:00' },
            { round: 9, fileType: 'PT', fileSize: '343MB', hash: 'u4v5w6x7s2t3', createTime: '2024-06-16 03:20:00' },
            { round: 10, fileType: 'PT', fileSize: '350MB', hash: 'v5w6x7s2t3u4', createTime: '2024-06-16 05:05:00' }
          ],
          personalizedFiles: [
            { round: 1, fileType: 'PT', fileSize: '195MB', hash: 'y1z2a3b4c5d6', createTime: '2024-06-15 14:25:00' },
            { round: 2, fileType: 'PT', fileSize: '202MB', hash: 'z2a3b4c5d6y1', createTime: '2024-06-15 15:40:00' },
            { round: 3, fileType: 'PT', fileSize: '208MB', hash: 'a3b4c5d6y1z2', createTime: '2024-06-15 17:15:00' },
            { round: 4, fileType: 'PT', fileSize: '215MB', hash: 'b4c5d6y1z2a3', createTime: '2024-06-15 19:05:00' },
            { round: 5, fileType: 'PT', fileSize: '222MB', hash: 'c5d6y1z2a3b4', createTime: '2024-06-15 20:25:00' },
            { round: 6, fileType: 'PT', fileSize: '228MB', hash: 'd6y1z2a3b4c5', createTime: '2024-06-15 22:10:00' },
            { round: 7, fileType: 'PT', fileSize: '235MB', hash: 'y2z3a4b5c6d7', createTime: '2024-06-15 23:55:00' },
            { round: 8, fileType: 'PT', fileSize: '242MB', hash: 'z3a4b5c6d7y2', createTime: '2024-06-16 01:40:00' },
            { round: 9, fileType: 'PT', fileSize: '248MB', hash: 'a4b5c6d7y2z3', createTime: '2024-06-16 03:25:00' },
            { round: 10, fileType: 'PT', fileSize: '255MB', hash: 'b5c6d7y2z3a4', createTime: '2024-06-16 05:10:00' }
          ]
        },
        {
          id: '2003',
          time: '2024-07-05 10:20:00',
          round: 80,
          agency: '006',
          personalized: true,
          global: false,
          type: '个性化模型',
          orgs: ['华南师范大学', '广州职业技术学院', '中山大学', '南方医科大学附属医院', '广州中心医院'],
          function: '为特定院校学生提供定制化心理健康干预方案。',
          tech: '结合本地化数据和专家知识，提升干预效果。',
          rounds: [
            { round: 1, gradient: 210, score: 8, reward: 9 },
            { round: 2, gradient: 190, score: 8, reward: 9 },
            { round: 3, gradient: 170, score: 9, reward: 10 },
            { round: 4, gradient: 150, score: 9, reward: 10 },
            { round: 5, gradient: 130, score: 7, reward: 8 },
            { round: 6, gradient: 110, score: 7, reward: 8 },
            { round: 7, gradient: 90, score: 8, reward: 9 },
            { round: 8, gradient: 70, score: 7, reward: 9 },
            { round: 9, gradient: 50, score: 8, reward: 9 },
            { round: 10, gradient: 30, score: 7, reward: 8 }
          ],
          globalFiles: [
            { round: 1, fileType: 'PT', fileSize: '225MB', hash: 'e1f2g3h4i5j6', createTime: '2024-07-05 09:30:00' },
            { round: 2, fileType: 'PT', fileSize: '232MB', hash: 'f2g3h4i5j6e1', createTime: '2024-07-05 10:45:00' },
            { round: 3, fileType: 'PT', fileSize: '238MB', hash: 'g3h4i5j6e1f2', createTime: '2024-07-05 12:20:00' },
            { round: 4, fileType: 'PT', fileSize: '245MB', hash: 'h4i5j6e1f2g3', createTime: '2024-07-05 14:10:00' },
            { round: 5, fileType: 'PT', fileSize: '252MB', hash: 'i5j6e1f2g3h4', createTime: '2024-07-05 15:30:00' },
            { round: 6, fileType: 'PT', fileSize: '258MB', hash: 'j6e1f2g3h4i5', createTime: '2024-07-05 17:15:00' },
            { round: 7, fileType: 'PT', fileSize: '265MB', hash: 'e2f3g4h5i6j7', createTime: '2024-07-05 19:00:00' },
            { round: 8, fileType: 'PT', fileSize: '272MB', hash: 'f3g4h5i6j7e2', createTime: '2024-07-05 20:45:00' },
            { round: 9, fileType: 'PT', fileSize: '278MB', hash: 'g4h5i6j7e2f3', createTime: '2024-07-05 22:30:00' },
            { round: 10, fileType: 'PT', fileSize: '285MB', hash: 'h5i6j7e2f3g4', createTime: '2024-07-06 00:15:00' }
          ],
          personalizedFiles: [
            { round: 1, fileType: 'PT', fileSize: '154MB', hash: 'k1l2m3n4o5p6', createTime: '2024-07-05 09:35:00' },
            { round: 2, fileType: 'PT', fileSize: '161MB', hash: 'l2m3n4o5p6k1', createTime: '2024-07-05 10:50:00' },
            { round: 3, fileType: 'PT', fileSize: '168MB', hash: 'm3n4o5p6k1l2', createTime: '2024-07-05 12:25:00' },
            { round: 4, fileType: 'PT', fileSize: '175MB', hash: 'n4o5p6k1l2m3', createTime: '2024-07-05 14:15:00' },
            { round: 5, fileType: 'PT', fileSize: '182MB', hash: 'o5p6k1l2m3n4', createTime: '2024-07-05 15:35:00' },
            { round: 6, fileType: 'PT', fileSize: '188MB', hash: 'p6k1l2m3n4o5', createTime: '2024-07-05 17:20:00' },
            { round: 7, fileType: 'PT', fileSize: '195MB', hash: 'k2l3m4n5o6p7', createTime: '2024-07-05 19:05:00' },
            { round: 8, fileType: 'PT', fileSize: '202MB', hash: 'l3m4n5o6p7k2', createTime: '2024-07-05 20:50:00' },
            { round: 9, fileType: 'PT', fileSize: '208MB', hash: 'm4n5o6p7k2l3', createTime: '2024-07-05 22:35:00' },
            { round: 10, fileType: 'PT', fileSize: '215MB', hash: 'n5o6p7k2l3m4', createTime: '2024-07-06 00:20:00' }
          ]
        }
      ],
      registerForm: {
        username: '',
        password: '',
        role: '',
        phone: '',
        email: '',
      },
      registerRules: {
        username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
        password: [ { required: true, message: '请输入密码', trigger: 'blur' } ],
        role: [ { required: true, message: '请选择角色', trigger: 'change' } ],
        phone: [ { required: true, message: '请输入手机号', trigger: 'blur' } ],
        email: [ { required: true, message: '请输入邮箱', trigger: 'blur' } ],
      },
      userList: [
        { username: 'admin', role: 'admin', phone: '13800000000', email: 'admin@test.com', registerTime: '2024-07-01 10:00' },
        { username: 'doctor1', role: 'doctor', phone: '13900000001', email: 'doc1@test.com', registerTime: '2024-07-02 09:30' },
        { username: 'counselor1', role: 'counselor', phone: '13700000002', email: 'counselor1@test.com', registerTime: '2024-07-03 14:20' },
        { username: 'user1', role: 'user', phone: '13600000003', email: 'user1@test.com', registerTime: '2024-07-04 08:10' },
      ],
      editDialogVisible: false,
      editForm: {
        username: '',
        role: '',
        phone: '',
        email: '',
      },
      addLocalForm: {
        function: '',
        tech: '',
        reward: null,
        fileList: [],
      },
      addLocalRules: {
        function: [ { required: true, message: '请输入模型功能', trigger: 'blur' } ],
        tech: [ { required: true, message: '请输入技术介绍', trigger: 'blur' } ],
        reward: [ { required: true, message: '请输入激励积分', trigger: 'blur' } ],
        file: [ { required: true, message: '请上传模型参数文件', trigger: 'change' } ],
      },
      addCollabForm: {
        function: '',
        tech: '',
        reward: null,
        orgs: [],
        fileList: [],
      },
      addCollabRules: {
        function: [ { required: true, message: '请输入模型功能', trigger: 'blur' } ],
        tech: [ { required: true, message: '请输入技术介绍', trigger: 'blur' } ],
        reward: [ { required: true, message: '请输入激励积分', trigger: 'blur' } ],
        orgs: [ { required: true, message: '请选择参与机构', trigger: 'change' } ],
        file: [ { required: true, message: '请上传模型参数文件', trigger: 'change' } ],
      },
      allOrgs: [
        '北京师范大学',
        '深圳职业技术学院',
        '清华大学',
        '北京大学附属医院',
        '北京安定医院',
        '华东师范大学',
        '上海工艺美术职业学院',
        '上海交通大学',
        '复旦大学附属医院',
        '上海精神卫生中心',
        '华中师范大学',
        '武汉职业技术学院',
        '武汉大学',
        '华中科技大学附属医院',
        '武汉中心医院',
        '华南师范大学',
        '广州职业技术学院',
        '中山大学',
        '南方医科大学附属医院',
        '广州中心医院'
      ],
    };
  },
  methods: {
    handleMenuSelect(key) {
      this.menuActive = key;
    },
    handleViewLocal(row) {
      this.$message.info(`查看本地模型：模型ID ${row.id}`);
    },
    handleTrainLocal(row) {
      row.training = true;
      this.$message.success(`训练本地模型：模型ID ${row.id}`);
    },
    handleStopTrainLocal(row) {
      row.training = false;
      this.$message.warning(`停止训练本地模型：模型ID ${row.id}`);
    },
    handleViewCollab(row) {
      this.$message.info(`查看协同模型：模型ID ${row.id}`);
    },
    handleJoinPersonalized(row) {
      row.personalized = true;
      this.$message.success(`加入个性化：模型ID ${row.id}`);
    },
    handleStopPersonalized(row) {
      row.personalized = false;
      this.$message.warning(`停止个性化：模型ID ${row.id}`);
    },
    handleJoinGlobal(row) {
      row.global = true;
      this.$message.success(`加入全局：模型ID ${row.id}`);
    },
    handleStopGlobal(row) {
      row.global = false;
      this.$message.warning(`停止全局：模型ID ${row.id}`);
    },
    submitRegister() {
      this.$refs.registerFormRef.validate((valid) => {
        if (valid) {
          this.userList.push({
            username: this.registerForm.username,
            role: this.registerForm.role,
            phone: this.registerForm.phone,
            email: this.registerForm.email,
            registerTime: new Date().toLocaleString(),
          });
          this.$message.success('注册成功！');
          this.resetRegister();
        }
      });
    },
    resetRegister() {
      this.registerForm = { username: '', password: '', role: '', phone: '', email: '' };
      this.$refs.registerFormRef.resetFields();
    },
    editUser(row) {
      this.editForm = { ...row };
      this.editDialogVisible = true;
    },
    saveEditUser() {
      const idx = this.userList.findIndex(u => u.username === this.editForm.username);
      if (idx !== -1) {
        this.userList[idx] = { ...this.editForm, registerTime: this.userList[idx].registerTime };
        this.$message.success('保存成功！');
      }
      this.editDialogVisible = false;
    },
    deleteUser(row) {
      this.userList = this.userList.filter(u => u.username !== row.username);
      this.$message.success('删除成功！');
    },
    goToModelDetail(id) {
      this.$router.push(`/admin/model-detail/${id}`)
    },
    toggleExpand(row) {
      this.$refs.collabTable.toggleRowExpansion(row)
    },
    toggleExpandLocal(row) {
      this.$refs.localTable.toggleRowExpansion(row)
    },
    handleExpand(row, expandedRows) {
      // 可根据需要处理展开事件
    },
    verifyFile(file) {
      this.$message.success(`验证文件：轮次${file.round}，哈希值${file.hash}`);
    },
    downloadFile(file) {
      this.$message.success(`下载文件：轮次${file.round}，文件大小${file.fileSize}`);
    },
    handleFileChange(file, fileList) {
      this.addLocalForm.fileList = fileList.slice(-1);
    },
    handleRemoveFile(file, fileList) {
      this.addLocalForm.fileList = fileList;
    },
    beforeRemoveFile(file, fileList) {
      return this.$confirm(`确定移除文件 ${file.name} 吗？`);
    },
    uploadToBlockchain() {
      this.$refs.addLocalFormRef.validate(valid => {
        if (!valid) return;
        this.$message.success('模型已上传至区块链（模拟）');
        // 这里可添加实际上传逻辑
      });
    },
    handleCollabFileChange(file, fileList) {
      this.addCollabForm.fileList = fileList.slice(-1);
    },
    handleRemoveCollabFile(file, fileList) {
      this.addCollabForm.fileList = fileList;
    },
    beforeRemoveCollabFile(file, fileList) {
      return this.$confirm(`确定移除文件 ${file.name} 吗？`);
    },
    uploadCollabToBlockchain() {
      this.$refs.addCollabFormRef.validate(valid => {
        if (!valid) return;
        this.$message.success('协同模型已上传至区块链（模拟）');
        // 这里可添加实际上传逻辑
      });
    },
  },
};
</script>

<style scoped>
.main-content {
  height: 100vh;
  width: 100vw;
  background: #f5f7fa;
}
.table-title {
  font-size: 22px;
  font-weight: bold;
  margin: 20px 0 20px 10px;
}
.btn-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.align-center {
  width: 100%;
  min-width: 100px;
  max-width: 320px;
  justify-content: center;
}
.model-info-container {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e1bee7;
  box-shadow: 0 2px 8px rgba(156, 39, 176, 0.1);
}
.model-details-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.global-model-info {
  flex: 1;
  background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #c8e6c9;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
}
.global-model-info h3 {
  color: #2e7d32;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}
.personalized-model-info {
  flex: 1;
  background: linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ffcc80;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.1);
}
.personalized-model-info h3 {
  color: #ef6c00;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}
.local-model-info {
  background: linear-gradient(135deg, #e1f5fe 0%, #f0f9ff 100%);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #81d4fa;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
}
.local-model-info h3 {
  color: #0277bd;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}
</style> 